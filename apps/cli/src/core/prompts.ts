import { multiselect, select } from '@clack/prompts';
import handleCancel from '../utils/isCancel.js';
import { promptDatabase } from '../modules/packages/db/index.js';
import type {
  FormatterType,
  GitHookType,
  LinterType,
  ServerRuntime,
  WebFramework,
  WorkspaceAnswers,
} from '../types/index.js';

export async function askApps(): Promise<('web' | 'server')[]> {
  const apps = await multiselect({
    message: 'Which applications would you like to include in apps/?',
    options: [
      {
        value: 'web',
        label: 'Frontend Apps',
        hint: 'Next.js, Vite',
      },
      {
        value: 'server',
        label: 'Backend Server',
        hint: 'Express, Hono',
      },
    ],
    required: false,
  });

  handleCancel(apps);
  return apps as ('web' | 'server')[];
}

export async function askServerRuntime(): Promise<ServerRuntime> {
  const runtime = await select({
    message: 'Which runtime would you like to use for the backend server?',
    options: [
      {
        value: 'node',
        label: 'Node.js',
        hint: 'Standard Node runtime',
      },
      {
        value: 'bun',
        label: 'Bun',
        hint: 'Fast all-in-one runtime',
      },
    ],
    initialValue: 'node',
  });

  handleCancel(runtime);
  return runtime as ServerRuntime;
}

export async function askLinter(
  webFramework?: WebFramework,
): Promise<LinterType> {
  const isNext = webFramework === 'nextjs';
  const isReact = webFramework === 'react';

  const options = isNext
    ? [
        {
          value: 'biome',
          label: 'Biome (Recommended for Next.js)',
          hint: 'Fast Rust-based all-in-one toolchain',
        },
        {
          value: 'oxlint',
          label: 'Oxlint',
          hint: 'Fast Rust linter',
        },
        {
          value: 'none',
          label: 'None',
          hint: 'Skip',
        },
      ]
    : [
        {
          value: 'oxlint',
          label: isReact ? 'Oxlint (Recommended for React + Vite)' : 'Oxlint',
          hint: 'Fast Rust linter',
        },
        {
          value: 'biome',
          label: 'Biome',
          hint: 'Rust toolchain',
        },
        {
          value: 'none',
          label: 'None',
          hint: 'Skip',
        },
      ];

  const initialValue: LinterType = isNext ? 'biome' : 'oxlint';

  const linter = await select({
    message: 'Which linter would you like to use?',
    options,
    initialValue,
  });

  handleCancel(linter);
  return linter as LinterType;
}

export async function askFormatter(
  linter?: LinterType,
): Promise<FormatterType> {
  const initialValue: FormatterType = linter === 'biome' ? 'biome' : 'prettier';

  const formatter = await select({
    message: 'Which code formatter would you like to use?',
    options: [
      {
        value: 'prettier',
        label: 'Prettier',
        hint: 'Standard formatter',
      },
      {
        value: 'biome',
        label:
          linter === 'biome' ? 'Biome (Included with Biome linter)' : 'Biome',
        hint: 'Fast formatter',
      },
      {
        value: 'none',
        label: 'None',
        hint: 'Skip',
      },
    ],
    initialValue,
  });

  handleCancel(formatter);
  return formatter as FormatterType;
}

export async function askGitHooks(): Promise<GitHookType> {
  const hook = await select({
    message: 'Which Git hooks manager would you like to set up?',
    options: [
      {
        value: 'lefthook',
        label: 'Lefthook',
        hint: 'Fast Go-based',
      },
      {
        value: 'husky',
        label: 'Husky',
        hint: 'Classic pre-commit',
      },
      {
        value: 'none',
        label: 'None',
        hint: 'Skip',
      },
    ],
    initialValue: 'lefthook',
  });

  handleCancel(hook);
  return hook as GitHookType;
}

export async function askTypescript(): Promise<boolean> {
  const choice = await select({
    message: 'Do you want to configure shared TypeScript configurations?',
    options: [
      {
        value: 'yes',
        label: 'Yes',
        hint: '@config/typescript',
      },
      {
        value: 'no',
        label: 'No',
        hint: 'Skip',
      },
    ],
    initialValue: 'yes',
  });

  handleCancel(choice);
  return choice === 'yes';
}

export async function askRedis(): Promise<boolean> {
  const choice = await select({
    message: 'Do you want to setup Redis using Docker?',
    options: [
      {
        value: 'yes',
        label: 'Yes',
        hint: 'Docker container',
      },
      {
        value: 'no',
        label: 'No',
        hint: 'Skip',
      },
    ],
    initialValue: 'no',
  });

  handleCancel(choice);
  return choice === 'yes';
}

export async function promptWorkspaceOptions(): Promise<WorkspaceAnswers> {
  const selectedApps = await askApps();
  const db = await promptDatabase();
  const setupRedis = await askRedis();
  const linter = await askLinter();
  const formatter = await askFormatter();
  const gitHook = await askGitHooks();
  const includeTypescript = await askTypescript();

  return {
    name: '',
    projectPath: '',
    gitInitialized: false,
    selectedApps,
    db,
    setupRedis,
    linter,
    formatter,
    gitHook,
    includeTypescript,
  };
}
