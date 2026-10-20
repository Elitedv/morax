import fsPromises from 'fs/promises';
import path from 'path';
import { runCommand } from '../../../../../utils/exec.js';
import type { ServerSetupOptions } from '../../types.js';
import {
  getExpressDependencies,
  getExpressDevDependencies,
  getExpressScripts,
} from './package.js';
import { renderExpressNodeTemplate } from './templates/node.js';
import { renderExpressBunTemplate } from './templates/bun.js';

export async function setupExpress(options: ServerSetupOptions) {
  const { projectPath, runtime, linter, orm } = options;
  const serverDir = path.join(projectPath, 'apps', 'server');
  const srcDir = path.join(serverDir, 'src');
  const hasDb = orm !== 'none';

  // 1. Create directory structure apps/server/src recursively
  await fsPromises.mkdir(srcDir, { recursive: true });

  // 2. Initialize package.json using pnpm init
  await runCommand('pnpm init', { cwd: serverDir, silent: true });

  // 3. Customize apps/server/package.json
  const serverPackagePath = path.join(serverDir, 'package.json');
  const serverPackageRaw = await fsPromises.readFile(serverPackagePath, 'utf8');
  const serverPkg = JSON.parse(serverPackageRaw);

  serverPkg.name = 'server';
  serverPkg.version = '1.0.0';
  serverPkg.private = true;
  serverPkg.type = 'module';
  serverPkg.main = 'dist/index.js';
  serverPkg.scripts = getExpressScripts(runtime, linter);

  serverPkg.devDependencies = {
    '@config/typescript': 'workspace:*',
  };

  if (hasDb) {
    serverPkg.dependencies = {
      ...(serverPkg.dependencies || {}),
      '@repo/db': 'workspace:*',
    };
  }

  delete serverPkg.keywords;
  delete serverPkg.author;
  delete serverPkg.license;

  await fsPromises.writeFile(
    serverPackagePath,
    JSON.stringify(serverPkg, null, 2),
    'utf8',
  );

  // 4. Create tsconfig.json extending the base shared config
  const tsconfigContent = {
    extends: '@config/typescript/tsconfig.json',
    compilerOptions: {
      rootDir: 'src',
      outDir: 'dist',
    },
    include: ['src/**/*'],
  };

  await fsPromises.writeFile(
    path.join(serverDir, 'tsconfig.json'),
    JSON.stringify(tsconfigContent, null, 2),
    'utf8',
  );

  // 5. Create tsdown.config.ts for fast, modern Rolldown-powered builds
  const tsdownConfigContent = [
    "import { defineConfig } from 'tsdown';",
    '',
    'export default defineConfig({',
    "  entry: ['./src/index.ts'],",
    "  format: 'esm',",
    "  platform: 'node',",
    '  clean: true,',
    '});',
    '',
  ].join('\n');

  await fsPromises.writeFile(
    path.join(serverDir, 'tsdown.config.ts'),
    tsdownConfigContent,
    'utf8',
  );

  // 6. Install dependencies dynamically using pnpm add
  const deps = getExpressDependencies();
  await runCommand(`pnpm add ${deps.join(' ')}`, {
    cwd: serverDir,
    silent: true,
  });

  const devDeps = getExpressDevDependencies(runtime);
  await runCommand(`pnpm add -D ${devDeps.join(' ')}`, {
    cwd: serverDir,
    silent: true,
  });

  // 7. Create src/index.ts with starter code
  const indexTsContent =
    runtime === 'bun'
      ? renderExpressBunTemplate(hasDb)
      : renderExpressNodeTemplate(hasDb);

  await fsPromises.writeFile(
    path.join(srcDir, 'index.ts'),
    indexTsContent,
    'utf8',
  );
}
