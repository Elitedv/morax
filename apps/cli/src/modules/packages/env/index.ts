import fsPromises from 'fs/promises';
import path from 'path';
import { confirm, spinner } from '@clack/prompts';
import pc from 'picocolors';
import handleCancel from '../../../utils/isCancel.js';
import type { EnvSetupOptions } from './types.js';
import { getEnvPackageJson } from './package.js';
import { renderCreateEnvTemplate } from './templates/create-env.js';
import { renderServerEnvTemplate } from './templates/server.js';
import { renderDbEnvTemplate } from './templates/db.js';
import { renderDockerEnvTemplate } from './templates/docker.js';
import { renderWebEnvTemplate } from './templates/web.js';
import { renderAuthEnvTemplate } from './templates/auth.js';
import { renderIndexEnvTemplate } from './templates/index.js';
import { renderCheckEnvTemplate } from './templates/check.js';

export * from './types.js';

export async function promptEnv(): Promise<boolean> {
  const result = await confirm({
    message: 'Do you want to setup type-safe environment package (@repo/env)?',
    initialValue: true,
  });
  handleCancel(result);
  return result as boolean;
}

export async function addDependencyToPackage(
  pkgJsonPath: string,
  depName: string,
  depVersion: string,
) {
  try {
    const raw = await fsPromises.readFile(pkgJsonPath, 'utf8');
    const pkg = JSON.parse(raw);
    pkg.dependencies = {
      ...(pkg.dependencies || {}),
      [depName]: depVersion,
    };
    await fsPromises.writeFile(
      pkgJsonPath,
      JSON.stringify(pkg, null, 2),
      'utf8',
    );
  } catch {
    // If package.json does not exist or fails, skip silently
  }
}

async function updateDbForEnv(projectPath: string, dialect?: string) {
  const dbDir = path.join(projectPath, 'packages', 'db');
  const clientFile = path.join(dbDir, 'src', 'client.ts');
  const drizzleConfigFile = path.join(dbDir, 'drizzle.config.ts');

  // 1. Update src/client.ts to use env.db
  try {
    const content = await fsPromises.readFile(clientFile, 'utf8');
    let newContent = '';

    if (content.includes('drizzle-orm/libsql')) {
      newContent = [
        "import { drizzle } from 'drizzle-orm/libsql';",
        "import { createClient } from '@libsql/client';",
        "import { env } from '@repo/env';",
        "import * as schema from './schema/index.js';",
        '',
        'export const client = createClient({ url: env.db.DB_FILE_NAME });',
        'export const db = drizzle({ client, schema });',
        'export type Database = typeof db;',
        '',
      ].join('\n');
    } else if (content.includes('drizzle-orm/neon-serverless')) {
      newContent = [
        "import { drizzle } from 'drizzle-orm/neon-serverless';",
        "import { Pool } from '@neondatabase/serverless';",
        "import { env } from '@repo/env';",
        "import * as schema from './schema/index.js';",
        '',
        'export const pool = new Pool({',
        '  connectionString: env.db.DATABASE_URL,',
        '});',
        '',
        'export const db = drizzle({ client: pool, schema } as any);',
        'export type Database = typeof db;',
        '',
      ].join('\n');
    } else if (content.includes('drizzle-orm/neon-http')) {
      newContent = [
        "import { drizzle } from 'drizzle-orm/neon-http';",
        "import { neon } from '@neondatabase/serverless';",
        "import { env } from '@repo/env';",
        "import * as schema from './schema/index.js';",
        '',
        'export const sql = neon(env.db.DATABASE_URL);',
        'export const db = drizzle({ client: sql, schema });',
        'export type Database = typeof db;',
        '',
      ].join('\n');
    } else if (content.includes('drizzle-orm/node-postgres')) {
      newContent = [
        "import { drizzle } from 'drizzle-orm/node-postgres';",
        "import { Pool } from 'pg';",
        "import { env } from '@repo/env';",
        "import * as schema from './schema/index.js';",
        '',
        'export const pool = new Pool({',
        '  connectionString: env.db.DATABASE_URL,',
        '});',
        '',
        'export const db = drizzle({ client: pool, schema } as any);',
        'export type Database = typeof db;',
        '',
      ].join('\n');
    }

    if (newContent) {
      await fsPromises.writeFile(clientFile, newContent, 'utf8');
    }
  } catch {
    // If client.ts is not present, skip
  }

  // 2. Update drizzle.config.ts to use env.db
  try {
    const isSqlite = dialect === 'sqlite';
    const envVar = isSqlite ? 'DB_FILE_NAME' : 'DATABASE_URL';
    const dbDialect = dialect || 'postgresql';
    const newDrizzleConfig = [
      "import { defineConfig } from 'drizzle-kit';",
      "import { env } from '@repo/env';",
      '',
      'export default defineConfig({',
      "  out: './drizzle',",
      "  schema: './src/schema/index.ts',",
      `  dialect: '${dbDialect}',`,
      '  dbCredentials: {',
      `    url: env.db.${envVar},`,
      '  },',
      '});',
      '',
    ].join('\n');
    await fsPromises.writeFile(drizzleConfigFile, newDrizzleConfig, 'utf8');
  } catch {
    // If drizzle.config.ts is not present, skip
  }
}

async function updateServerEntryForEnv(projectPath: string) {
  const indexFile = path.join(projectPath, 'apps', 'server', 'src', 'index.ts');
  try {
    let content = await fsPromises.readFile(indexFile, 'utf8');

    if (!content.includes('@repo/env')) {
      content = "import { env } from '@repo/env';\n" + content;
    }

    // Replace process.env.PORT throw check with env.server.PORT
    content = content.replace(
      /if \(!process\.env\.PORT\) \{[\s\S]*?const port = Number\(process\.env\.PORT\);/,
      'const port = env.server.PORT;',
    );

    // Replace app.use(cors()) with origin from env.server
    content = content.replace(
      /app\.use\(cors\(\)\);/,
      'app.use(cors({ origin: env.server.CORS_ORIGIN }));',
    );
    content = content.replace(
      /app\.use\('\*', cors\(\)\);/,
      "app.use('*', cors({ origin: env.server.CORS_ORIGIN }));",
    );

    await fsPromises.writeFile(indexFile, content, 'utf8');
  } catch {
    // If apps/server entry is not present, skip
  }
}

export async function setupEnvPackage(options: EnvSetupOptions) {
  const {
    projectPath,
    hasDb,
    dbDialect,
    hasServer,
    hasDocker,
    hasAuth,
    webFramework,
  } = options;
  const hasWebEnv = webFramework !== 'skip' || Boolean(hasAuth);
  const envDir = path.join(projectPath, 'packages', 'env');
  const srcDir = path.join(envDir, 'src');
  const schemaDir = path.join(srcDir, 'schema');

  // 1. Create directories
  await fsPromises.mkdir(schemaDir, { recursive: true });

  // 2. Write package.json
  const pkgContent = getEnvPackageJson(options);
  await fsPromises.writeFile(
    path.join(envDir, 'package.json'),
    JSON.stringify(pkgContent, null, 2),
    'utf8',
  );

  // 3. Write tsconfig.json
  const tsconfig = {
    extends: '@config/typescript/tsconfig.json',
    compilerOptions: {
      rootDir: 'src',
      outDir: 'dist',
    },
    include: ['src/**/*'],
  };
  await fsPromises.writeFile(
    path.join(envDir, 'tsconfig.json'),
    JSON.stringify(tsconfig, null, 2),
    'utf8',
  );

  // 4. Generate src/create-env.ts internal helper
  const createEnvCode = renderCreateEnvTemplate();
  await fsPromises.writeFile(
    path.join(srcDir, 'create-env.ts'),
    createEnvCode,
    'utf8',
  );

  // 5. Generate src/schema/db.ts if db is present
  if (hasDb) {
    const dbCode = renderDbEnvTemplate(options);
    await fsPromises.writeFile(path.join(schemaDir, 'db.ts'), dbCode, 'utf8');
  }

  // 6. Generate src/schema/docker.ts if docker is configured
  if (hasDocker) {
    const dockerCode = renderDockerEnvTemplate(options);
    await fsPromises.writeFile(
      path.join(schemaDir, 'docker.ts'),
      dockerCode,
      'utf8',
    );
  }

  // 7. Generate src/schema/server.ts if backend is present
  if (hasServer || hasDb) {
    const serverCode = renderServerEnvTemplate(options);
    await fsPromises.writeFile(
      path.join(schemaDir, 'server.ts'),
      serverCode,
      'utf8',
    );
  }

  // 8. Generate src/schema/auth.ts if auth is present
  if (hasAuth) {
    const authCode = renderAuthEnvTemplate(options);
    await fsPromises.writeFile(
      path.join(schemaDir, 'auth.ts'),
      authCode,
      'utf8',
    );
  }

  // 9. Generate src/schema/web.ts if frontend web is present OR if auth is selected
  if (hasWebEnv) {
    const webCode = renderWebEnvTemplate(options);
    await fsPromises.writeFile(path.join(schemaDir, 'web.ts'), webCode, 'utf8');
  }

  // 10. Generate src/check.ts standalone CLI validation runner
  const checkCode = renderCheckEnvTemplate(options);
  await fsPromises.writeFile(path.join(srcDir, 'check.ts'), checkCode, 'utf8');

  // 11. Generate src/index.ts
  const indexCode = renderIndexEnvTemplate(options);
  await fsPromises.writeFile(path.join(srcDir, 'index.ts'), indexCode, 'utf8');

  // 12. Wire @repo/env into packages/db, apps/server, packages/auth, and apps/web
  if (hasDb) {
    await addDependencyToPackage(
      path.join(projectPath, 'packages', 'db', 'package.json'),
      '@repo/env',
      'workspace:*',
    );
    await updateDbForEnv(projectPath, dbDialect);
  }

  if (hasServer) {
    await addDependencyToPackage(
      path.join(projectPath, 'apps', 'server', 'package.json'),
      '@repo/env',
      'workspace:*',
    );
    await updateServerEntryForEnv(projectPath);
  }

  if (hasAuth) {
    await addDependencyToPackage(
      path.join(projectPath, 'packages', 'auth', 'package.json'),
      '@repo/env',
      'workspace:*',
    );
  }

  if (webFramework !== 'skip') {
    const appsDir = path.join(projectPath, 'apps');
    try {
      const entries = await fsPromises.readdir(appsDir, {
        withFileTypes: true,
      });
      for (const entry of entries) {
        if (entry.isDirectory() && entry.name !== 'server') {
          await addDependencyToPackage(
            path.join(appsDir, entry.name, 'package.json'),
            '@repo/env',
            'workspace:*',
          );
        }
      }
    } catch {}
  }
}

export async function runEnvSetup(
  projectPath: string,
  options: EnvSetupOptions,
) {
  const s = spinner();
  s.start('Configuring type-safe environment package in packages/env...');
  try {
    await setupEnvPackage(options);
    s.stop(
      pc.green(
        '✔ Success: Type-safe environment package (@repo/env) configured in packages/env',
      ),
    );
  } catch (error: any) {
    s.stop(pc.red('✖ Failed: Environment package setup failed'));
    console.error(pc.red(`\nError details: ${error.message || error}`));
    process.exit(1);
  }
}
