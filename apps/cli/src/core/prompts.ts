import { multiselect, select } from '@clack/prompts';
import handleCancel from '../utils/isCancel.js';
import { promptDatabase } from '../modules/packages/db/index.js';
import type {
  FormatterType,
  GitHookType,
  LinterType,
  ServerRuntime,
  WorkspaceAnswers,
} from '../types/index.js';

export async function askApps(): Promise<('web' | 'server')[]> {
  const apps = await multiselect({
    message: 'Which applications would you like to include in apps/?',
    options: [
      {
        value: 'web',
        label: 'Frontend Apps',
        hint: 'Next.js, React + Vite',
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
        hint: 'Standard Node.js runtime (tsx, tsc, tsdown)',
      },
      {
        value: 'bun',
        label: 'Bun',
        hint: 'Fast all-in-one JavaScript & TypeScript runtime (bun, tsdown)',
      },
    ],
    initialValue: 'node',
  });

  handleCancel(runtime);
  return runtime as ServerRuntime;
}

export async function askLinter(): Promise<LinterType> {
  const linter = await select({
    message: 'Which linter would you like to use?',
    options: [
      {
        value: 'oxlint',
        label: 'Oxlint',
        hint: 'Blazingly fast Rust linter with bleeding-edge TS support',
      },
      {
        value: 'biome',
        label: 'Biome',
        hint: 'Fast Rust linter with rich built-in lint rules',
      },
      {
        value: 'none',
        label: 'None',
        hint: 'Skip linter configuration',
      },
    ],
    initialValue: 'oxlint',
  });

  handleCancel(linter);
  return linter as LinterType;
}

export async function askFormatter(): Promise<FormatterType> {
  const formatter = await select({
    message: 'Which code formatter would you like to use?',
    options: [
      {
        value: 'prettier',
        label: 'Prettier',
        hint: 'Industry-standard code formatting (.prettierrc)',
      },
      {
        value: 'biome',
        label: 'Biome',
        hint: 'Ultra-fast Rust code formatter',
      },
      {
        value: 'none',
        label: 'None',
        hint: 'Skip code formatter',
      },
    ],
    initialValue: 'prettier',
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
        hint: 'Fast, powerful cross-platform Git hooks (Go-based)',
      },
      {
        value: 'husky',
        label: 'Husky',
        hint: 'Classic Node-based Git pre-commit hooks',
      },
      {
        value: 'none',
        label: 'None',
        hint: 'Skip Git hooks setup',
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
        hint: 'Modular @config/typescript package',
      },
      {
        value: 'no',
        label: 'No',
        hint: 'Skip shared TypeScript config',
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
        hint: 'Pre-configured Redis container in docker/docker-compose.yml',
      },
      {
        value: 'no',
        label: 'No',
        hint: 'Skip Redis setup',
      },
    ],
    initialValue: 'no',
  });

  handleCancel(choice);
  return choice === 'yes';
}

export async function gatherWorkspaceAnswers(
  name: string,
  projectPath: string,
  gitInitialized: boolean,
): Promise<WorkspaceAnswers> {
  const selectedApps = await askApps();

  let serverRuntime: ServerRuntime | undefined;
  if (selectedApps.includes('server')) {
    serverRuntime = await askServerRuntime();
  }

  const db = await promptDatabase();
  const setupRedis = await askRedis();
  const linter = await askLinter();
  const formatter = await askFormatter();

  let gitHook: GitHookType = 'none';
  if (gitInitialized) {
    gitHook = await askGitHooks();
  }

  let includeTypescript = selectedApps.includes('server') || db.orm !== 'none';
  if (!includeTypescript) {
    includeTypescript = await askTypescript();
  }

  return {
    name,
    projectPath,
    gitInitialized,
    selectedApps,
    serverRuntime,
    db,
    setupRedis,
    linter,
    formatter,
    gitHook,
    includeTypescript,
  };
}
