import { confirm, spinner } from '@clack/prompts';
import pc from 'picocolors';
import fsPromises from 'fs/promises';
import path from 'path';
import { runCommand } from '../../utils/exec.js';

export async function promptPrettier() {
  return await confirm({
    message: 'Do you want to setup Prettier code formatting in root?',
    initialValue: true,
  });
}

export async function setupPrettier(projectPath: string) {
  // 1. Install prettier dynamically with exact version at the workspace root
  await runCommand('pnpm add -D -E prettier -w', { cwd: projectPath });

  // 2. Generate standard .prettierrc JSON config
  const prettierConfig = {
    semi: true,
    singleQuote: true,
    trailingComma: 'all',
    tabWidth: 2,
    printWidth: 80,
  };

  await fsPromises.writeFile(
    path.join(projectPath, '.prettierrc'),
    JSON.stringify(prettierConfig, null, 2),
    'utf8',
  );

  // 3. Generate standard .prettierignore
  const prettierIgnore = [
    'node_modules/',
    'dist/',
    'build/',
    '.next/',
    'pnpm-lock.yaml',
    '',
  ].join('\n');

  await fsPromises.writeFile(
    path.join(projectPath, '.prettierignore'),
    prettierIgnore,
    'utf8',
  );

  // 4. Inject format scripts into root package.json
  const rootPackagePath = path.join(projectPath, 'package.json');
  const rootPackageRaw = await fsPromises.readFile(rootPackagePath, 'utf8');
  const pkg = JSON.parse(rootPackageRaw);

  pkg.scripts = {
    ...(pkg.scripts || {}),
    format: 'prettier --write .',
  };

  await fsPromises.writeFile(
    rootPackagePath,
    JSON.stringify(pkg, null, 2),
    'utf8',
  );

  // 5. Initial format execution to clean up generated files
  await runCommand('pnpm format', { cwd: projectPath });
}

export async function runPrettierSetup(projectPath: string) {
  const s = spinner();
  s.start('Setting up Prettier auto-formatting...');
  try {
    await setupPrettier(projectPath);
    s.stop(pc.green('✔ Success: Prettier formatting configured'));
  } catch (error: any) {
    s.stop(pc.red('✖ Failed: Prettier setup failed'));
    console.error(pc.red(`\nError details: ${error.message || error}`));
    process.exit(1);
  }
}
