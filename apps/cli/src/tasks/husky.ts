import { confirm, spinner } from '@clack/prompts';
import pc from 'picocolors';
import handleCancel from '../utils/isCancel.js';
import fsPromises from 'fs/promises';
import path from 'path';
import { runCommand } from '../utils/exec.js';

export async function promptHusky() {
  return await confirm({
    message: 'Do you want to setup Husky pre-commit hooks?',
    initialValue: true,
  });
}

export async function setupHusky(projectPath: string) {
  // 1. Install Husky dynamically with exact version at the workspace root
  await runCommand('pnpm add -D -E husky -w', { cwd: projectPath });

  // 2. Initialize Husky using its official init generator
  await runCommand('pnpm exec husky init', { cwd: projectPath });

  // 3. Update the auto-generated .husky/pre-commit file to run format and stage files
  const preCommitPath = path.join(projectPath, '.husky', 'pre-commit');
  let hookContent = '';
  try {
    hookContent = await fsPromises.readFile(preCommitPath, 'utf8');
  } catch {
    hookContent = 'pnpm test'; // Default fallback
  }

  // Replace default test commands with formatting checks
  hookContent = hookContent.replace('pnpm test', 'pnpm format');

  // Append staging of newly formatted files
  if (!hookContent.includes('git add .')) {
    hookContent = hookContent.trim() + '\ngit add .\n';
  }

  await fsPromises.writeFile(preCommitPath, hookContent, 'utf8');

  try {
    await fsPromises.chmod(preCommitPath, 0o755);
  } catch {}
}

export async function runHuskySetup(
  projectPath: string,
  gitInitialized: boolean,
) {
  if (!gitInitialized) return;

  const huskyPrompt = await promptHusky();

  handleCancel(huskyPrompt);

  if (huskyPrompt) {
    const s = spinner();
    console.log('\n');
    s.start('Setting up Husky hooks...');
    try {
      await setupHusky(projectPath);
      s.stop(pc.green('✔ Success: Husky pre-commit hooks configured'));
    } catch (error: any) {
      s.stop(pc.red('✖ Failed: Husky setup failed'));
      console.error(pc.red(`\nError details: ${error.message || error}`));
      process.exit(1);
    }
    console.log('\n');
  }
}
