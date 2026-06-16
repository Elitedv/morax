import { spinner } from '@clack/prompts';
import pc from 'picocolors';
import fsPromises from 'fs/promises';
import path from 'path';
import { runCommand } from '../utils/exec.js';

export async function setupEslint(projectPath: string) {
  const eslintDir = path.join(projectPath, 'packages', 'eslint');

  // 1. Create packages/eslint directory recursively
  await fsPromises.mkdir(eslintDir, { recursive: true });

  // 2. Initialize the package using pnpm init
  await runCommand('pnpm init', { cwd: eslintDir, silent: true });

  // 3. Customize the packages/eslint/package.json
  const eslintPackagePath = path.join(eslintDir, 'package.json');
  const eslintPackageRaw = await fsPromises.readFile(eslintPackagePath, 'utf8');
  const eslintPkg = JSON.parse(eslintPackageRaw);

  eslintPkg.name = '@config/eslint';
  eslintPkg.version = '1.0.0';
  eslintPkg.private = true;
  eslintPkg.type = 'module';
  eslintPkg.main = 'eslint.config.ts';
  eslintPkg.exports = {
    '.': './eslint.config.ts',
  };
  eslintPkg.scripts = {
    lint: 'eslint .',
  };

  // Remove defaults that are not needed
  delete eslintPkg.keywords;
  delete eslintPkg.author;
  delete eslintPkg.license;

  await fsPromises.writeFile(
    eslintPackagePath,
    JSON.stringify(eslintPkg, null, 2),
    'utf8',
  );

  // 4. Run pnpm add -D dynamically to fetch and install only the latest packages
  await runCommand(
    'pnpm add -D eslint @eslint/js @eslint/json globals typescript-eslint',
    { cwd: eslintDir },
  );

  // 5. Create Modern eslint.config.ts with Flat Config and @eslint/json support
  const eslintConfigContent = [
    'import js from "@eslint/js";',
    'import globals from "globals";',
    'import tseslint from "typescript-eslint";',
    'import eslintJson from "@eslint/json";',
    '',
    'export default tseslint.config(',
    '  {',
    '    ignores: ["**/dist/**", "**/node_modules/**"],',
    '  },',
    '  js.configs.recommended,',
    '  ...tseslint.configs.recommended,',
    '  {',
    '    languageOptions: {',
    '      globals: {',
    '        ...globals.node,',
    '      },',
    '    },',
    '    rules: {',
    '      "no-unused-vars": "off",',
    '      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],',
    '    },',
    '  },',
    '  {',
    '    files: ["**/*.json"],',
    '    language: "json/json",',
    '    ...eslintJson.configs.recommended,',
    '  }',
    ');',
    '',
  ].join('\n');

  await fsPromises.writeFile(
    path.join(eslintDir, 'eslint.config.ts'),
    eslintConfigContent,
    'utf8',
  );

  // 6. Inject lint script into root package.json
  const rootPackagePath = path.join(projectPath, 'package.json');
  const rootPackageContent = await fsPromises.readFile(rootPackagePath, 'utf8');
  const rootPkg = JSON.parse(rootPackageContent);

  rootPkg.scripts = {
    ...(rootPkg.scripts || {}),
    lint: 'pnpm --filter @config/eslint lint',
  };

  await fsPromises.writeFile(
    rootPackagePath,
    JSON.stringify(rootPkg, null, 2),
    'utf8',
  );
}

export async function runEslintSetup(projectPath: string) {
  // Ensure the packages folder option was generated/exists
  const packagesDir = path.join(projectPath, 'packages');
  try {
    await fsPromises.access(packagesDir);
  } catch {
    // If the packages folder was not scaffolded, we shouldn't attempt to setup ESLint there
    return;
  }

  const s = spinner();
  console.log('\n');
  s.start('Setting up modular ESLint in packages/eslint...');
  try {
    await setupEslint(projectPath);
    s.stop(pc.green('✔ Success: Modular ESLint configured in packages/eslint'));
  } catch (error: any) {
    s.stop(pc.red('✖ Failed: ESLint setup failed'));
    console.error(pc.red(`\nError details: ${error.message || error}`));
    process.exit(1);
  }
  console.log('\n');
}
