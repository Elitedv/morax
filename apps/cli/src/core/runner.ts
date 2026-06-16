import path from 'path';
import { spinner, multiselect } from '@clack/prompts';
import pc from 'picocolors';

import { startCli } from './startcli.js';
import { promptWorkspaceName } from './workspaceName.js';
import { makeDirectories } from '../tasks/directories.js';
import { runReactScaffolder } from './react-runner.js';
import { runNextScaffolder } from './next-runner.js';
import { runPrettierSetup } from '../tasks/prettier.js';
import { runEslintSetup } from '../tasks/eslint.js';
import { runTypescriptSetup } from '../tasks/typescript.js';
import { runServerSetup } from '../tasks/server.js';
import { runGitSetup } from '../tasks/git.js';
import { runHuskySetup } from '../tasks/husky.js';
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

  // Ask which tools and features to include upfront
  const selectedApps = await askServerorFrontendInclue();
  const selectedTools = await askWhichToolToInclude(
    selectedApps.includes('server'),
  );

  // 5. Execute Prettier setup if selected
  if (selectedTools.includes('prettier')) {
    await runPrettierSetup(projectPath);
  }

  // 6. Execute Husky setup if selected and git is initialized
  if (selectedTools.includes('husky')) {
    await runHuskySetup(projectPath, gitInitialized);
  }

  // 7. Execute ESLint setup if selected
  if (selectedTools.includes('eslint')) {
    await runEslintSetup(projectPath);
  }

  // 8. Execute TypeScript setup if selected
  if (selectedTools.includes('typescript')) {
    await runTypescriptSetup(projectPath);
  }

  // 9. Execute Express Backend setup if selected
  if (selectedApps.includes('server')) {
    await runServerSetup(projectPath);
  }

  // 10. Execute Next.js/Vite Frontend setup if selected
  if (selectedApps.includes('web')) {
    await addNextjs(projectPath);
  }

  // 11. Run final pnpm install to resolve all workspace configurations and symlinks
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

async function askWhichToolToInclude(hasServer: boolean) {
  const options = [
    {
      value: 'prettier',
      label: 'Prettier',
      hint: 'Code formatter rules & auto-formatting script',
    },
    {
      value: 'husky',
      label: 'Husky',
      hint: 'Git pre-commit hooks setup (requires Git)',
    },
  ];

  if (!hasServer) {
    options.splice(
      1,
      0,
      {
        value: 'eslint',
        label: 'ESLint',
        hint: 'Modern Flat Config linter configurations',
      },
      {
        value: 'typescript',
        label: 'TypeScript',
        hint: 'Extendable shared TypeScript configurations',
      },
    );
  }

  const tools = await multiselect({
    message: hasServer
      ? 'ESLint & TypeScript are required for the Express backend. Select additional configurations/tools:'
      : 'Which configurations/linter tools would you like to set up?',
    options,
    required: false,
  });

  handleCancel(tools);

  const selectedTools = tools as string[];
  if (hasServer) {
    if (!selectedTools.includes('eslint')) selectedTools.push('eslint');
    if (!selectedTools.includes('typescript')) selectedTools.push('typescript');
  }

  return selectedTools;
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
