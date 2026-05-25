import { confirm, spinner } from '@clack/prompts';
import pc from 'picocolors';
import handleCancel from '../utils/isCancel.js';
import fsPromises from 'fs/promises';
import path from 'path';
import { runCommand } from '../utils/exec.js';

export async function promptGit() {
  return await confirm({
    message: 'Do you want to initialize a local Git repository?',
    initialValue: true,
  });
}

export async function gitInit(projectPath: string) {
  // 1. Initialize empty git repository
  await runCommand('git init', { cwd: projectPath, silent: true });

  // 2. Create high-quality standard .gitignore
  const gitignore = [
    '# Dependency directories',
    'node_modules/',
    'jspm_packages/',
    'web_modules/',
    '',
    '# Build and output outputs',
    'dist/',
    'build/',
    '.next/',
    'out/',
    '.turbo/',
    '',
    '# Environments',
    '.env',
    '.env.local',
    '.env.development.local',
    '.env.test.local',
    '.env.production.local',
    '',
    '# Logs',
    'npm-debug.log*',
    'yarn-debug.log*',
    'yarn-error.log*',
    'pnpm-debug.log*',
    '*.log',
    '',
    '# OS Metadata',
    '.DS_Store',
    'Thumbs.db',
    '',
  ].join('\n');

  await fsPromises.writeFile(
    path.join(projectPath, '.gitignore'),
    gitignore,
    'utf8',
  );
}

export async function runGitSetup(projectPath: string): Promise<boolean> {
  const gitPrompt = await promptGit();

  handleCancel(gitPrompt);

  let gitInitialized = false;
  if (gitPrompt) {
    const s = spinner();
    console.log('\n');
    s.start('Initializing Git repository...');
    try {
      await gitInit(projectPath);
      s.stop(pc.green('✔ Success: Git repository initialized'));
      gitInitialized = true;
    } catch (error: any) {
      s.stop(pc.red('✖ Failed: Git initialization failed'));
      console.error(pc.red(`\nError details: ${error.message || error}`));
      process.exit(1);
    }
    console.log('\n');
  }
  return gitInitialized;
}
