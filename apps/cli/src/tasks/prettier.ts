import { confirm, spinner } from '@clack/prompts';
import pc from 'picocolors';
import handleCancel from '../utils/isCancel.js';
import fsPromises from 'fs/promises';
import path from 'path';
import { runCommand } from '../utils/exec.js';

export async function promptPrettier() {
  return await confirm({
    message: 'Do you want to setup Prettier code formatting?',
    initialValue: true,
  });
}

export async function setupPrettier(projectPath: string) {
  // 1. Install Prettier dynamically with exact version at the workspace root
  await runCommand('pnpm add -D -E prettier -w', { cwd: projectPath });

  // 2. Create high-quality modern .prettierrc
  const prettierrc = {
    semi: true,
    singleQuote: true,
    tabWidth: 2,
    trailingComma: 'all',
    printWidth: 100,
  };

  await fsPromises.writeFile(
    path.join(projectPath, '.prettierrc'),
    JSON.stringify(prettierrc, null, 2),
    'utf8',
  );

  // 3. Create comprehensive .prettierignore
  const prettierignore = [
    '# Dependencies',
    'node_modules/',
    'jspm_packages/',
    'web_modules/',
    '',
    '# Build and outputs',
    'dist/',
    'build/',
    '.next/',
    'out/',
    '.turbo/',
    '',
    '# Configuration locks',
    'pnpm-lock.yaml',
    '',
    '# Environment files',
    '.env',
    '.env.*',
    '',
  ].join('\n');

  await fsPromises.writeFile(
    path.join(projectPath, '.prettierignore'),
    prettierignore,
    'utf8',
  );

  // 4. Inject format script to root package.json
  const rootPackagePath = path.join(projectPath, 'package.json');
  const rootPackageContent = await fsPromises.readFile(rootPackagePath, 'utf8');
  const pkg = JSON.parse(rootPackageContent);

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
  const prettierPrompt = await promptPrettier();

  handleCancel(prettierPrompt);

  if (prettierPrompt) {
    const s = spinner();
    console.log('\n');
    s.start('Setting up Prettier auto-formatting...');
    try {
      await setupPrettier(projectPath);
      s.stop(pc.green('✔ Success: Prettier formatting configured'));
    } catch (error: any) {
      s.stop(pc.red('✖ Failed: Prettier setup failed'));
      console.error(pc.red(`\nError details: ${error.message || error}`));
      process.exit(1);
    }
    console.log('\n');
  }
}
