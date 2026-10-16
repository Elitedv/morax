import { spinner } from '@clack/prompts';
import pc from 'picocolors';
import fsPromises from 'fs/promises';
import path from 'path';
import { runCommand } from '../../utils/exec.js';

export async function setupTypescript(projectPath: string) {
  const tsDir = path.join(projectPath, 'packages', 'typescript');

  // 1. Create directory structure packages/typescript recursively
  await fsPromises.mkdir(tsDir, { recursive: true });

  // 2. Initialize package.json using pnpm init
  await runCommand('pnpm init', { cwd: tsDir, silent: true });

  // 3. Customize packages/typescript/package.json
  const tsPackagePath = path.join(tsDir, 'package.json');
  const tsPackageRaw = await fsPromises.readFile(tsPackagePath, 'utf8');
  const tsPkg = JSON.parse(tsPackageRaw);

  tsPkg.name = '@config/typescript';
  tsPkg.version = '1.0.0';
  tsPkg.private = true;
  tsPkg.files = ['tsconfig.json'];

  // Remove defaults that are not needed
  delete tsPkg.main;
  delete tsPkg.scripts;
  delete tsPkg.keywords;
  delete tsPkg.author;
  delete tsPkg.license;

  await fsPromises.writeFile(
    tsPackagePath,
    JSON.stringify(tsPkg, null, 2),
    'utf8',
  );

  // 4. Create standard tsconfig.json base config
  const tsconfigContent = {
    $schema: 'https://json.schemastore.org/tsconfig',
    compilerOptions: {
      target: 'ES2022',
      module: 'NodeNext',
      moduleResolution: 'NodeNext',
      lib: ['ES2022'],
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      isolatedModules: true,
    },
  };

  await fsPromises.writeFile(
    path.join(tsDir, 'tsconfig.json'),
    JSON.stringify(tsconfigContent, null, 2),
    'utf8',
  );
}

export async function runTypescriptSetup(projectPath: string) {
  // Ensure the packages folder option was generated/exists
  const packagesDir = path.join(projectPath, 'packages');
  try {
    await fsPromises.access(packagesDir);
  } catch {
    // If the packages folder was not scaffolded, we shouldn't attempt to setup TS config there
    return;
  }

  const s = spinner();
  s.start('Setting up modular TypeScript config in packages/typescript...');
  try {
    await setupTypescript(projectPath);
    s.stop(
      pc.green(
        '✔ Success: Modular TypeScript config configured in packages/typescript',
      ),
    );
  } catch (error: any) {
    s.stop(pc.red('✖ Failed: TypeScript config setup failed'));
    console.error(pc.red(`\nError details: ${error.message || error}`));
    process.exit(1);
  }
}
