import { spinner } from '@clack/prompts';
import pc from 'picocolors';
import fsPromises from 'fs/promises';
import path from 'path';
import { runCommand } from '../../utils/exec.js';

export async function setupOxlint(projectPath: string) {
  // 1. Install oxlint dynamically at the workspace root
  await runCommand('pnpm add -D -E oxlint -w', {
    cwd: projectPath,
    silent: true,
  });

  // 2. Generate a standard, modern .oxlintrc.json configuration file
  const oxlintConfig = {
    $schema: './node_modules/oxlint/configuration_schema.json',
    plugins: ['typescript', 'react', 'unicorn'],
    categories: {
      correctness: 'warn',
    },
    rules: {
      'no-unused-vars': 'error',
      'no-debugger': 'error',
    },
  };

  await fsPromises.writeFile(
    path.join(projectPath, '.oxlintrc.json'),
    JSON.stringify(oxlintConfig, null, 2),
    'utf8',
  );

  // 3. Inject lint script into root package.json
  const rootPackagePath = path.join(projectPath, 'package.json');
  const rootPackageContent = await fsPromises.readFile(rootPackagePath, 'utf8');
  const rootPkg = JSON.parse(rootPackageContent);

  rootPkg.scripts = {
    ...(rootPkg.scripts || {}),
    lint: 'oxlint .',
  };

  await fsPromises.writeFile(
    rootPackagePath,
    JSON.stringify(rootPkg, null, 2),
    'utf8',
  );
}

export async function runOxlintSetup(projectPath: string) {
  const s = spinner();
  s.start('Configuring ultra-fast Oxlint linter...');
  try {
    await setupOxlint(projectPath);
    s.stop(
      pc.green('✔ Success: Oxlint configured with latest TypeScript support'),
    );
  } catch (error: any) {
    s.stop(pc.red('✖ Failed: Oxlint setup failed'));
    console.error(pc.red(`\nError details: ${error.message || error}`));
    process.exit(1);
  }
}
