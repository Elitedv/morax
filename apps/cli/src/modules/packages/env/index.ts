import fsPromises from 'fs/promises';
import path from 'path';
import { confirm, spinner } from '@clack/prompts';
import pc from 'picocolors';
import handleCancel from '../../../utils/isCancel.js';
import type { EnvSetupOptions } from './types.js';
import { getEnvPackageJson } from './package.js';
import { renderServerEnvTemplate } from './templates/server.js';
import { renderWebEnvTemplate } from './templates/web.js';
import { renderIndexEnvTemplate } from './templates/index.js';

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

export async function setupEnvPackage(options: EnvSetupOptions) {
  const { projectPath, hasDb, hasServer, webFramework } = options;
  const envDir = path.join(projectPath, 'packages', 'env');
  const srcDir = path.join(envDir, 'src');

  // 1. Create directories
  await fsPromises.mkdir(srcDir, { recursive: true });

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

  // 4. Generate src/server.ts if backend or db is present
  if (hasServer || hasDb) {
    const serverCode = renderServerEnvTemplate(options);
    await fsPromises.writeFile(
      path.join(srcDir, 'server.ts'),
      serverCode,
      'utf8',
    );
  }

  // 5. Generate src/web.ts if frontend web is present
  if (webFramework !== 'skip') {
    const webCode = renderWebEnvTemplate(options);
    await fsPromises.writeFile(path.join(srcDir, 'web.ts'), webCode, 'utf8');
  }

  // 6. Generate src/index.ts
  const indexCode = renderIndexEnvTemplate(options);
  await fsPromises.writeFile(path.join(srcDir, 'index.ts'), indexCode, 'utf8');

  // 7. Wire @repo/env into packages/db, apps/server, and apps/web
  if (hasDb) {
    await addDependencyToPackage(
      path.join(projectPath, 'packages', 'db', 'package.json'),
      '@repo/env',
      'workspace:*',
    );
  }

  if (hasServer) {
    await addDependencyToPackage(
      path.join(projectPath, 'apps', 'server', 'package.json'),
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
