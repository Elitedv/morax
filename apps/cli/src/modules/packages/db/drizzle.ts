import { select, spinner } from '@clack/prompts';
import pc from 'picocolors';
import handleCancel from '../../../utils/isCancel.js';
import fsPromises from 'fs/promises';
import path from 'path';
import { runCommand } from '../../../utils/exec.js';
import type {
  DbDialect,
  NeonConnectionMode,
  PostgresProvider,
} from '../../../types/index.js';

export async function promptDrizzle(): Promise<{
  dialect: DbDialect;
  postgresProvider?: PostgresProvider;
  neonMode?: NeonConnectionMode;
}> {
  const dialectChoice = await select({
    message: 'Which database dialect would you like to use with Drizzle?',
    options: [
      {
        value: 'postgresql',
        label: 'PostgreSQL',
        hint: 'Docker / Neon',
      },
      {
        value: 'sqlite',
        label: 'SQLite',
        hint: 'LibSQL / Turso',
      },
    ],
    initialValue: 'postgresql',
  });

  handleCancel(dialectChoice);
  const dialect = dialectChoice as DbDialect;

  if (dialect === 'postgresql') {
    const providerChoice = await select({
      message: 'Which PostgreSQL setup would you like to use?',
      options: [
        {
          value: 'docker',
          label: 'Docker (Local)',
          hint: 'docker-compose.yml',
        },
        {
          value: 'neon',
          label: 'Neon (Serverless)',
          hint: 'Serverless cloud',
        },
      ],
      initialValue: 'docker',
    });

    handleCancel(providerChoice);
    const postgresProvider = providerChoice as PostgresProvider;

    let neonMode: NeonConnectionMode | undefined;
    if (postgresProvider === 'neon') {
      const modeChoice = await select({
        message: 'Which connection mode would you like to use with Neon?',
        options: [
          {
            value: 'serverless',
            label: 'Serverless HTTP',
            hint: 'neon-http (edge)',
          },
          {
            value: 'pool',
            label: 'Connection Pool',
            hint: 'WebSocket pool',
          },
        ],
        initialValue: 'serverless',
      });

      handleCancel(modeChoice);
      neonMode = modeChoice as NeonConnectionMode;
    }

    return { dialect, postgresProvider, neonMode };
  }

  return { dialect };
}

export async function setupDrizzle(
  projectPath: string,
  dialect: DbDialect = 'postgresql',
  linter: string = 'none',
  postgresProvider: PostgresProvider = 'docker',
  neonMode: NeonConnectionMode = 'serverless',
) {
  const dbDir = path.join(projectPath, 'packages', 'db');
  const srcDir = path.join(dbDir, 'src');
  const schemaDir = path.join(srcDir, 'schema');
  const seedDir = path.join(srcDir, 'seed');

  // 1. Create directory structure packages/db/src/{schema,seed} recursively
  await fsPromises.mkdir(schemaDir, { recursive: true });
  await fsPromises.mkdir(seedDir, { recursive: true });

  // 2. Initialize package.json using pnpm init
  await runCommand('pnpm init', { cwd: dbDir, silent: true });

  // 3. Customize packages/db/package.json
  const dbPackagePath = path.join(dbDir, 'package.json');
  const dbPackageRaw = await fsPromises.readFile(dbPackagePath, 'utf8');
  const dbPkg = JSON.parse(dbPackageRaw);

  const providerLabel =
    dialect === 'sqlite'
      ? 'SQLite'
      : postgresProvider === 'neon'
        ? `PostgreSQL (Neon ${neonMode === 'pool' ? 'Pool' : 'Serverless'})`
        : 'PostgreSQL (Docker)';

  dbPkg.name = '@repo/db';
  dbPkg.version = '1.0.0';
  dbPkg.description = `Shared Drizzle ORM database layer (${providerLabel})`;
  dbPkg.private = true;
  dbPkg.type = 'module';
  dbPkg.main = './src/index.ts';
  dbPkg.types = './src/index.ts';
  dbPkg.exports = {
    '.': {
      types: './src/index.ts',
      default: './src/index.ts',
    },
    './schema': {
      types: './src/schema/index.ts',
      default: './src/schema/index.ts',
    },
  };
  dbPkg.scripts = {
    build: 'tsc',
    'db:generate': 'drizzle-kit generate',
    'db:migrate': 'drizzle-kit migrate',
    'db:push': 'drizzle-kit push',
    'db:seed': 'tsx src/seed/seed.ts',
    'db:studio': 'drizzle-kit studio',
    'db:check': 'drizzle-kit check',
  };
  if (linter === 'biome') {
    dbPkg.scripts.lint = 'biome lint .';
  } else if (linter === 'oxlint') {
    dbPkg.scripts.lint = 'oxlint .';
  }

  dbPkg.devDependencies = {
    '@config/typescript': 'workspace:*',
  };

  // Remove defaults that are not needed
  delete dbPkg.keywords;
  delete dbPkg.author;
  delete dbPkg.license;

  await fsPromises.writeFile(
    dbPackagePath,
    JSON.stringify(dbPkg, null, 2),
    'utf8',
  );

  // 4. Create tsconfig.json matching rootDir: . and node types for drizzle.config.ts
  const tsconfigContent = {
    extends: '@config/typescript/tsconfig.json',
    compilerOptions: {
      rootDir: '.',
      outDir: 'dist',
      declaration: true,
      types: ['node'],
    },
    include: ['src/**/*', 'drizzle.config.ts'],
  };

  await fsPromises.writeFile(
    path.join(dbDir, 'tsconfig.json'),
    JSON.stringify(tsconfigContent, null, 2),
    'utf8',
  );

  // 5. Install dependencies dynamically using pnpm add (using @rc for latest Drizzle)
  if (dialect === 'sqlite') {
    await runCommand('pnpm add drizzle-orm@rc @libsql/client dotenv', {
      cwd: dbDir,
      silent: false,
    });
  } else if (postgresProvider === 'neon') {
    await runCommand(
      'pnpm add drizzle-orm@rc @neondatabase/serverless dotenv',
      {
        cwd: dbDir,
        silent: false,
      },
    );
  } else {
    // Docker / standard PostgreSQL
    await runCommand('pnpm add drizzle-orm@rc pg dotenv @types/pg', {
      cwd: dbDir,
      silent: false,
    });
  }

  await runCommand(
    'pnpm add -D drizzle-kit@rc @types/node tsx typescript@latest',
    {
      cwd: dbDir,
      silent: false,
    },
  );

  // 6. Generate drizzle.config.ts with package-relative .env loading
  const envVar = dialect === 'sqlite' ? 'DB_FILE_NAME' : 'DATABASE_URL';

  const drizzleConfigContent = [
    "import { config } from 'dotenv';",
    "import { defineConfig } from 'drizzle-kit';",
    "import path from 'node:path';",
    "import { fileURLToPath } from 'node:url';",
    '',
    'const packageDir = path.dirname(fileURLToPath(import.meta.url));',
    "const workspaceRoot = path.resolve(packageDir, '../..');",
    "config({ path: path.join(workspaceRoot, '.env') });",
    "config({ path: path.join(packageDir, '.env'), override: true });",
    '',
    `if (!process.env.${envVar}) {`,
    `  throw new Error('${envVar} environment variable is required');`,
    '}',
    '',
    'export default defineConfig({',
    "  out: './drizzle',",
    "  schema: './src/schema/index.ts',",
    `  dialect: '${dialect}',`,
    '  dbCredentials: {',
    `    url: process.env.${envVar}!,`,
    '  },',
    '});',
    '',
  ].join('\n');

  await fsPromises.writeFile(
    path.join(dbDir, 'drizzle.config.ts'),
    drizzleConfigContent,
    'utf8',
  );

  // 7. Generate src/schema/index.ts
  let schemaContent: string;
  if (dialect === 'sqlite') {
    schemaContent = [
      "import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';",
      '',
      "export const users = sqliteTable('users', {",
      "  id: int('id').primaryKey({ autoIncrement: true }),",
      "  name: text('name').notNull(),",
      "  email: text('email').notNull().unique(),",
      "  createdAt: text('created_at')",
      '    .$defaultFn(() => new Date().toISOString())',
      '    .notNull(),',
      "  updatedAt: text('updated_at')",
      '    .$defaultFn(() => new Date().toISOString())',
      '    .notNull(),',
      '});',
      '',
      'export type User = typeof users.$inferSelect;',
      'export type NewUser = typeof users.$inferInsert;',
      '',
    ].join('\n');
  } else {
    // Both Docker and Neon PostgreSQL use drizzle-orm/pg-core
    schemaContent = [
      "import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';",
      '',
      "export const users = pgTable('users', {",
      "  id: uuid('id').defaultRandom().primaryKey(),",
      "  name: text('name').notNull(),",
      "  email: text('email').notNull().unique(),",
      "  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),",
      "  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),",
      '});',
      '',
      'export type User = typeof users.$inferSelect;',
      'export type NewUser = typeof users.$inferInsert;',
      '',
    ].join('\n');
  }

  await fsPromises.writeFile(
    path.join(schemaDir, 'index.ts'),
    schemaContent,
    'utf8',
  );

  // 8. Generate src/client.ts with strict environment variable checks
  let clientContent: string;
  if (dialect === 'sqlite') {
    clientContent = [
      "import { config } from 'dotenv';",
      "import path from 'node:path';",
      "import { fileURLToPath } from 'node:url';",
      "import { drizzle } from 'drizzle-orm/libsql';",
      "import { createClient } from '@libsql/client';",
      "import * as schema from './schema/index.js';",
      '',
      'const srcDir = path.dirname(fileURLToPath(import.meta.url));',
      "const workspaceRoot = path.resolve(srcDir, '../../..');",
      "const packageRoot = path.resolve(srcDir, '..');",
      "config({ path: path.join(workspaceRoot, '.env') });",
      "config({ path: path.join(packageRoot, '.env'), override: true });",
      '',
      'if (!process.env.DB_FILE_NAME) {',
      "  throw new Error('DB_FILE_NAME environment variable is required');",
      '}',
      '',
      'export const client = createClient({ url: process.env.DB_FILE_NAME });',
      'export const db = drizzle({ client, schema });',
      'export type Database = typeof db;',
      '',
    ].join('\n');
  } else if (postgresProvider === 'neon') {
    if (neonMode === 'pool') {
      // Neon WebSocket Pool
      clientContent = [
        "import { config } from 'dotenv';",
        "import path from 'node:path';",
        "import { fileURLToPath } from 'node:url';",
        "import { drizzle } from 'drizzle-orm/neon-serverless';",
        "import { Pool } from '@neondatabase/serverless';",
        "import * as schema from './schema/index.js';",
        '',
        'const srcDir = path.dirname(fileURLToPath(import.meta.url));',
        "const workspaceRoot = path.resolve(srcDir, '../../..');",
        "const packageRoot = path.resolve(srcDir, '..');",
        "config({ path: path.join(workspaceRoot, '.env') });",
        "config({ path: path.join(packageRoot, '.env'), override: true });",
        '',
        'if (!process.env.DATABASE_URL) {',
        "  throw new Error('DATABASE_URL environment variable is required');",
        '}',
        '',
        'export const pool = new Pool({',
        '  connectionString: process.env.DATABASE_URL,',
        '});',
        '',
        'export const db = drizzle({ client: pool, schema } as any);',
        'export type Database = typeof db;',
        '',
      ].join('\n');
    } else {
      // Neon Serverless HTTP
      clientContent = [
        "import { config } from 'dotenv';",
        "import path from 'node:path';",
        "import { fileURLToPath } from 'node:url';",
        "import { drizzle } from 'drizzle-orm/neon-http';",
        "import { neon } from '@neondatabase/serverless';",
        "import * as schema from './schema/index.js';",
        '',
        'const srcDir = path.dirname(fileURLToPath(import.meta.url));',
        "const workspaceRoot = path.resolve(srcDir, '../../..');",
        "const packageRoot = path.resolve(srcDir, '..');",
        "config({ path: path.join(workspaceRoot, '.env') });",
        "config({ path: path.join(packageRoot, '.env'), override: true });",
        '',
        'if (!process.env.DATABASE_URL) {',
        "  throw new Error('DATABASE_URL environment variable is required');",
        '}',
        '',
        'export const sql = neon(process.env.DATABASE_URL);',
        'export const db = drizzle({ client: sql, schema });',
        'export type Database = typeof db;',
        '',
      ].join('\n');
    }
  } else {
    // Docker / standard PostgreSQL (node-postgres Pool)
    clientContent = [
      "import { config } from 'dotenv';",
      "import path from 'node:path';",
      "import { fileURLToPath } from 'node:url';",
      "import { drizzle } from 'drizzle-orm/node-postgres';",
      "import { Pool } from 'pg';",
      "import * as schema from './schema/index.js';",
      '',
      'const srcDir = path.dirname(fileURLToPath(import.meta.url));',
      "const workspaceRoot = path.resolve(srcDir, '../../..');",
      "const packageRoot = path.resolve(srcDir, '..');",
      "config({ path: path.join(workspaceRoot, '.env') });",
      "config({ path: path.join(packageRoot, '.env'), override: true });",
      '',
      'if (!process.env.DATABASE_URL) {',
      "  throw new Error('DATABASE_URL environment variable is required');",
      '}',
      '',
      'export const pool = new Pool({',
      '  connectionString: process.env.DATABASE_URL,',
      '});',
      '',
      'export const db = drizzle({ client: pool, schema } as any);',
      'export type Database = typeof db;',
      '',
    ].join('\n');
  }

  await fsPromises.writeFile(
    path.join(srcDir, 'client.ts'),
    clientContent,
    'utf8',
  );

  // 9. Generate src/index.ts re-exporting client, schema, and drizzle-orm
  let clientExport: string;
  if (dialect === 'sqlite') {
    clientExport = "export { db, client, type Database } from './client.js';";
  } else if (postgresProvider === 'neon' && neonMode === 'serverless') {
    clientExport = "export { db, sql, type Database } from './client.js';";
  } else {
    clientExport = "export { db, pool, type Database } from './client.js';";
  }

  const indexContent = [
    clientExport,
    "export * from './schema/index.js';",
    "export * from 'drizzle-orm';",
    '',
  ].join('\n');

  await fsPromises.writeFile(
    path.join(srcDir, 'index.ts'),
    indexContent,
    'utf8',
  );

  // 10. Generate src/seed/seed.ts and src/seed/index.ts
  let seedTeardown: string;
  let seedImports: string;

  if (dialect === 'sqlite') {
    seedImports = "import { client, db } from '../client.js';";
    seedTeardown = 'client.close();';
  } else if (postgresProvider === 'neon' && neonMode === 'serverless') {
    seedImports = "import { db } from '../client.js';";
    seedTeardown =
      '// Serverless HTTP is stateless, no pool connection to close';
  } else {
    seedImports = "import { pool, db } from '../client.js';";
    seedTeardown = 'await pool.end();';
  }

  const seedScriptContent = [
    seedImports,
    "import { users } from '../schema/index.js';",
    '',
    '/**',
    ' * Starter database seeder',
    ' */',
    'export async function seed() {',
    "  console.log('🌱 [Seed] Starting database seeding...\\n');",
    '',
    '  try {',
    "    console.log('👥 [Seed] Seeding sample user...');",
    '    await db',
    '      .insert(users)',
    '      .values({',
    "        name: 'Demo User',",
    "        email: 'demo@example.com',",
    '      })',
    '      .onConflictDoNothing();',
    '',
    "    console.log('🎉 [Seed] Seeding completed successfully!\\n');",
    '  } catch (error) {',
    "    console.error('❌ [Seed] Error occurred during database seeding:', error);",
    '    process.exitCode = 1;',
    '  } finally {',
    `    ${seedTeardown}`,
    '  }',
    '}',
    '',
    '// Execute seed script if run directly',
    'seed().catch((err) => {',
    "  console.error('Fatal seed error:', err);",
    '  process.exit(1);',
    '});',
    '',
  ].join('\n');

  await fsPromises.writeFile(
    path.join(seedDir, 'seed.ts'),
    seedScriptContent,
    'utf8',
  );

  const seedIndexContent = ["export { seed } from './seed.js';", ''].join('\n');
  await fsPromises.writeFile(
    path.join(seedDir, 'index.ts'),
    seedIndexContent,
    'utf8',
  );

  // 11. Generate .gitignore
  const gitignoreContent = [
    'node_modules/',
    'dist/',
    '.env',
    '.env.local',
    '*.db',
    '*.db-journal',
    '',
  ].join('\n');
  await fsPromises.writeFile(
    path.join(dbDir, '.gitignore'),
    gitignoreContent,
    'utf8',
  );

  let dockerDocs = '';
  if (dialect === 'postgresql' && postgresProvider === 'docker') {
    dockerDocs = [
      '- `pnpm docker:db` — Start local PostgreSQL Docker container (run from workspace root).',
      '- `pnpm docker:down` — Stop Docker infrastructure (run from workspace root).',
    ].join('\n');
  }

  const readmeContent = [
    '# @repo/db',
    '',
    `Shared database layer powered by **Drizzle ORM (${providerLabel})**.`,
    '',
    '## Available Scripts',
    '',
    dockerDocs,
    '- `pnpm db:generate` — Generate SQL migrations based on schema changes.',
    '- `pnpm db:push` — Push schema directly to the database without generating migrations.',
    '- `pnpm db:migrate` — Apply generated migrations to the database.',
    '- `pnpm db:seed` — Seed starter database records.',
    '- `pnpm db:studio` — Open Drizzle Studio visual browser for inspecting and editing data.',
    '- `pnpm db:check` — Check migration history and verify consistency.',
    '',
  ]
    .filter(Boolean)
    .join('\n');

  await fsPromises.writeFile(
    path.join(dbDir, 'README.md'),
    readmeContent,
    'utf8',
  );
}

export async function runDrizzleSetup(
  projectPath: string,
  dialect: DbDialect = 'postgresql',
  linter: string = 'none',
  postgresProvider: PostgresProvider = 'docker',
  neonMode: NeonConnectionMode = 'serverless',
) {
  const packagesDir = path.join(projectPath, 'packages');
  try {
    await fsPromises.access(packagesDir);
  } catch {
    return;
  }

  const label =
    dialect === 'sqlite'
      ? 'SQLite'
      : postgresProvider === 'neon'
        ? `PostgreSQL - Neon ${neonMode === 'pool' ? 'Pool' : 'Serverless'}`
        : 'PostgreSQL - Docker';

  const s = spinner();
  s.start(`Setting up modular Drizzle ORM (${label}) in packages/db...`);
  try {
    await setupDrizzle(
      projectPath,
      dialect,
      linter,
      postgresProvider,
      neonMode,
    );
    s.stop(
      pc.green(
        `✔ Success: Modular Drizzle ORM (${label}) configured in packages/db`,
      ),
    );
  } catch (error: any) {
    s.stop(pc.red('✖ Failed: Drizzle ORM setup failed'));
    console.error(pc.red(`\nError details: ${error.message || error}`));
    process.exit(1);
  }
}
