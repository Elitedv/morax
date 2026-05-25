import fsPromises from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function setupHusky(projectPath: string) {
  // 1. Install Prettier and Husky dynamically with exact versions
  await execAsync('pnpm add --save-dev --save-exact prettier husky -w', {
    cwd: projectPath,
  });

  // 2. Add format script to root package.json
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

  // 3. Initialize Husky using its official init generator
  await execAsync('pnpm exec husky init', { cwd: projectPath });

  // 4. Update the auto-generated .husky/pre-commit file
  const preCommitPath = path.join(projectPath, '.husky', 'pre-commit');
  let hookContent = '';
  try {
    hookContent = await fsPromises.readFile(preCommitPath, 'utf8');
  } catch {
    hookContent = 'pnpm test';
  }

  // Replace default test commands with formatting checks
  hookContent = hookContent
    .replace('npm test', 'pnpm format')
    .replace('pnpm test', 'pnpm format')
    .replace('pnpm run test', 'pnpm format');

  // Append staging of newly formatted files
  if (!hookContent.includes('git add .')) {
    hookContent = hookContent.trim() + '\ngit add .\n';
  }

  await fsPromises.writeFile(preCommitPath, hookContent, 'utf8');

  try {
    await fsPromises.chmod(preCommitPath, 0o755);
  } catch {}

  // 5. Initial format execution
  await execAsync('pnpm format', { cwd: projectPath });

  // 6. Stage all changes for initial commit
  await execAsync('git add .', { cwd: projectPath });
}
