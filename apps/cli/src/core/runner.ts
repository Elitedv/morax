import path from 'path';
import { spinner, multiselect, select } from '@clack/prompts';
import pc from 'picocolors';

import { startCli } from './startcli.js';
import { promptWorkspaceName } from './workspaceName.js';
import { makeDirectories } from '../tasks/directories.js';
import { runReactScaffolder } from './react-runner.js';
import { runNextScaffolder } from './next-runner.js';
import { runPrettierSetup } from '../tasks/prettier.js';
import { runOxlintSetup } from '../tasks/oxlint.js';
import { runBiomeSetup } from '../tasks/biome.js';
import { runTypescriptSetup } from '../tasks/typescript.js';
import { runServerSetup } from '../tasks/server.js';
import { runGitSetup } from '../tasks/git.js';
import { runHuskySetup } from '../tasks/husky.js';
import { runLefthookSetup } from '../tasks/lefthook.js';
import { endCli } from './endcli.js';
import { runCommand } from '../utils/exec.js';
import { setupReadme } from '../tasks/addreadme.js';
import addNextjs from './web.js';
import handleCancel from '../utils/isCancel.js';

export async function runWorkspaceScaffolder(
  options: { react?: boolean; next?: boolean } = {},
) {
  // 1. Greet and display premium logo
  startCli();

  const isMonorepo = !options.react && !options.next;

  // 2. Prompt for Name (Optional, defaults to morax-workspace or my-app)
  const name = await promptWorkspaceName(isMonorepo);
  const projectPath = path.join(process.cwd(), name);

  if (options.react) {
    await runReactScaffolder(name, projectPath);
    return;
  }

  if (options.next) {
    await runNextScaffolder(name, projectPath);
    return;
  }

  // 3. Prompt and execute directories and workspace config generation
  await makeDirectories(name, projectPath);

  // Add the root README silently immediately after directory creation
  await setupReadme(projectPath, name);

  // 4. Prompt and execute Git initialization
  const gitInitialized = await runGitSetup(projectPath);

  // Ask which apps/servers to set up
  const selectedApps = await askServerorFrontendInclue();

  // Ask for Linter
  const linter = await askLinter();

  // Ask for Formatter
  const formatter = await askFormatter();

  // Ask for Git Hooks (if Git is initialized)
  let gitHook = 'none';
  if (gitInitialized) {
    gitHook = await askGitHooks();
  }

  // Ask for TypeScript if server was not selected (if server selected, TS is required)
  let includeTypescript = selectedApps.includes('server');
  if (!includeTypescript) {
    includeTypescript = await askTypescript();
  }

  // 5. Execute Biome setup if Biome was chosen for either linting or formatting
  if (linter === 'biome' || formatter === 'biome') {
    await runBiomeSetup(projectPath, {
      linter: linter === 'biome',
      formatter: formatter === 'biome',
    });
  }

  // 6. Execute Oxlint setup if selected
  if (linter === 'oxlint') {
    await runOxlintSetup(projectPath);
  }

  // 7. Execute Prettier setup if selected
  if (formatter === 'prettier') {
    await runPrettierSetup(projectPath);
  }

  // 8. Execute Git hooks setup (Lefthook or Husky)
  if (gitHook === 'lefthook') {
    await runLefthookSetup(
      projectPath,
      gitInitialized,
      formatter !== 'none',
      linter !== 'none',
    );
  } else if (gitHook === 'husky') {
    await runHuskySetup(projectPath, gitInitialized);
  }

  // 9. Execute TypeScript setup if selected
  if (includeTypescript) {
    await runTypescriptSetup(projectPath);
  }

  // 10. Execute Express Backend setup if selected
  if (selectedApps.includes('server')) {
    await runServerSetup(projectPath, linter);
  }

  // 11. Execute Next.js/Vite Frontend setup if selected
  if (selectedApps.includes('web')) {
    await addNextjs(projectPath);
  }

  // 12. Run final pnpm install to resolve all workspace configurations and symlinks
  const s = spinner();
  console.log('\n');
  s.start('Running final workspace package installation...');
  try {
    await runCommand('pnpm install', { cwd: projectPath, silent: true });
    s.stop(
      pc.green(
        '✔ Success: Workspace dependencies and symlinks configured successfully',
      ),
    );
  } catch (error: any) {
    s.stop(pc.red('✖ Warning: Final workspace installation failed'));
    console.error(pc.red(`\nError details: ${error.message || error}`));
  }
  console.log('\n');

  // 13. Complete and show beautiful finish screen
  endCli(name, projectPath);
}

async function askLinter(): Promise<string> {
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
  return linter as string;
}

async function askFormatter(): Promise<string> {
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
  return formatter as string;
}

async function askGitHooks(): Promise<string> {
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
  return hook as string;
}

async function askTypescript(): Promise<boolean> {
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

async function askServerorFrontendInclue() {
  const apps = await multiselect({
    message: 'Which backend/frontend applications would you like to set up?',
    options: [
      {
        value: 'web',
        label: 'Frontend Web App',
        hint: 'Scaffold Next.js or React (Vite) frontend in apps/web',
      },
      {
        value: 'server',
        label: 'Backend Server',
        hint: 'Scaffold Express backend in apps/server',
      },
    ],
    required: false,
  });

  handleCancel(apps);
  return apps as string[];
}
