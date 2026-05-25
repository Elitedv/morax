import { confirm, spinner } from '@clack/prompts';
import pc from 'picocolors';
import handleCancel from '../utils/isCancel.js';
import fsPromises from 'fs/promises';
import path from 'path';
import { runCommand } from '../utils/exec.js';

export async function promptTypescript() {
  return await confirm({
    message: 'Do you want to setup TypeScript config in packages/typescript?',
    initialValue: true,
  });
}

export async function setupTypescript(projectPath: string) {
  const tsDir = path.join(projectPath, 'packages', 'typescript');

  // 1. Create packages/typescript directory recursively
  await fsPromises.mkdir(tsDir, { recursive: true });

  // 2. Initialize the package using pnpm init
  await runCommand('pnpm init', { cwd: tsDir, silent: true });

  // 3. Customize the packages/typescript/package.json
  const tsPackagePath = path.join(tsDir, 'package.json');
  const tsPackageRaw = await fsPromises.readFile(tsPackagePath, 'utf8');
  const tsPkg = JSON.parse(tsPackageRaw);

  tsPkg.name = '@config/typescript';
  tsPkg.version = '1.0.0';
  tsPkg.private = true;
  tsPkg.type = 'module';
  tsPkg.exports = {
    './tsconfig.json': './tsconfig.json',
  };

  // Remove defaults that are not needed
  delete tsPkg.keywords;
  delete tsPkg.author;
  delete tsPkg.license;
  delete tsPkg.main;
  delete tsPkg.scripts;

  await fsPromises.writeFile(
    tsPackagePath,
    JSON.stringify(tsPkg, null, 2),
    'utf8',
  );

  // 4. Install typescript package dynamically as devDependency
  await runCommand(
    'cd ../.. && pnpm add -D typescript -w && cd packages/typescript',
    { cwd: tsDir, silent: true },
  );

  // 5. Initialize tsconfig.json using npx tsc --init
  await runCommand('npx tsc --init', { cwd: tsDir });
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

  const tsPrompt = await promptTypescript();

  handleCancel(tsPrompt);

  if (tsPrompt) {
    const s = spinner();
    console.log('\n');
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
    console.log('\n');
  }
}
