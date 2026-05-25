import path from 'path';
import pc from 'picocolors';
import {
  text,
  multiselect,
  confirm,
  isCancel,
  cancel,
  spinner,
  outro,
} from '@clack/prompts';
import boxen from 'boxen';

import { startCli } from './utils/startcli.js';
import { generateWorkspaceConfig } from './tasks/workspace.js';
import { createDirectories } from './tasks/directories.js';
import { gitInit } from './tasks/git.js';
import { setupHusky } from './tasks/husky.js';

async function main() {
  // 1. Greet and display premium logo
  startCli();

  // 2. Prompt for Name
  const name = await text({
    message: 'What is the name of your new monorepo workspace?',
    placeholder: 'my-morax-workspace',
    validate(value) {
      if (!value || value.trim().length === 0)
        return 'Workspace name is required!';
      if (value.includes(' ')) return 'Workspace name cannot contain spaces!';
    },
  });

  if (isCancel(name)) {
    cancel(pc.red('✖ Morax cancelled.'));
    process.exit(0);
  }

  const projectPath = path.join(process.cwd(), name);

  // 3. Prompt for Directories
  const directories = await multiselect({
    message: 'Which directories do you want to include in your workspace?',
    options: [
      {
        value: 'apps',
        label: 'apps/*',
        hint: 'For frontend apps and backend services',
      },
      {
        value: 'packages',
        label: 'packages/*',
        hint: 'For shared components, configs, and utilities',
      },
    ],
    required: true,
  });

  if (isCancel(directories)) {
    cancel(pc.red('✖ Morax cancelled.'));
    process.exit(0);
  }

  // --- IMMEDIATE EXECUTION: Workspace Scaffolding ---
  const s = spinner();
  console.log('\n');
  s.start('Generating workspace configs...');
  try {
    await generateWorkspaceConfig(
      name,
      directories as ('apps' | 'packages')[],
      projectPath,
    );
    await createDirectories(
      directories as ('apps' | 'packages')[],
      projectPath,
    );
    s.stop(pc.green('✔ Success: Generated Workspace Root & Folder Structures'));
  } catch (error: any) {
    s.stop(pc.red('✖ Failed: Workspace generation failed'));
    console.error(pc.red(`\nError details: ${error.message || error}`));
    process.exit(1);
  }
  console.log('\n');

  // 4. Prompt for Git (Immediate setup if Yes)
  const gitPrompt = await confirm({
    message: 'Do you want to initialize a local Git repository?',
    initialValue: true,
  });

  if (isCancel(gitPrompt)) {
    cancel(pc.red('✖ Morax cancelled.'));
    process.exit(0);
  }

  let gitInitialized = false;
  if (gitPrompt) {
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

  // 5. Prompt for Husky (Immediate setup if Yes and Git is active)
  if (gitInitialized) {
    const huskyPrompt = await confirm({
      message:
        'Do you want to setup Husky pre-commit hooks and auto-formatting?',
      initialValue: true,
    });

    if (isCancel(huskyPrompt)) {
      cancel(pc.red('✖ Morax cancelled.'));
      process.exit(0);
    }

    if (huskyPrompt) {
      console.log('\n');
      s.start('Setting up Husky & Prettier formatting...');
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

  // 6. Complete and show beautiful finish screen
  outro(pc.magenta('🌌 Morax scaffolding completed successfully!'));

  console.log(
    boxen(
      `⚡ ${pc.bold('Workspace ready:')} ${pc.cyan(name)}\n` +
        `Location: ${pc.yellow(projectPath)}\n\n` +
        `${pc.bold('To start developing:')}\n` +
        ` 1. ${pc.cyan(`cd ${name}`)}\n` +
        ` 2. ${pc.cyan('pnpm dev')}\n\n` +
        `Husky pre-commit formatting & automated git tracking is fully active.`,
      {
        padding: 1,
        margin: 1,
        borderStyle: 'double',
        borderColor: 'cyan',
        title: pc.cyan(' Setup Complete '),
        titleAlignment: 'center',
      },
    ),
  );
}

main().catch((err) => {
  console.error(pc.red('Fatal Error during execution:'), err);
  process.exit(1);
});
