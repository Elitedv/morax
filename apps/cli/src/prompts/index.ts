import { text, multiselect, confirm, isCancel, cancel } from '@clack/prompts';
import pc from 'picocolors';
import { WorkspaceConfig } from '../types/index.js';

export async function runPrompts(): Promise<WorkspaceConfig> {
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
    cancel(pc.red('✖ Scaffolding cancelled.'));
    process.exit(0);
  }

  const gitInit = await confirm({
    message: 'Do you want to initialize a local Git repository?',
    initialValue: true,
  });

  if (isCancel(gitInit)) {
    cancel(pc.red('✖ Scaffolding cancelled.'));
    process.exit(0);
  }

  let setupHusky = false;
  if (gitInit) {
    const huskyPrompt = await confirm({
      message:
        'Do you want to setup Husky pre-commit hooks and auto-formatting?',
      initialValue: true,
    });

    if (isCancel(huskyPrompt)) {
      cancel(pc.red('✖ Scaffolding cancelled.'));
      process.exit(0);
    }
    setupHusky = huskyPrompt;
  }

  return {
    name,
    directories: directories as ('apps' | 'packages')[],
    gitInit,
    setupHusky,
  };
}
