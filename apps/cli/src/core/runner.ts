import path from 'path';
import { spinner, multiselect } from '@clack/prompts';
import pc from 'picocolors';

import { startCli } from './startcli.js';
import { promptWorkspaceName } from './workspaceName.js';
import { makeDirectories } from '../tasks/directories.js';
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

export async function runWorkspaceScaffolder() {
  // 1. Greet and display premium logo
  startCli();

  // 2. Prompt for Name (Optional, defaults to morax-workspace)
  const name = await promptWorkspaceName();
  const projectPath = path.join(process.cwd(), name);

  // 3. Prompt and execute directories and workspace config generation
  await makeDirectories(name, projectPath);

  // Add the root README silently immediately after directory creation
  await setupReadme(projectPath, name);

  // 4. Prompt and execute Git initialization
  const gitInitialized = await runGitSetup(projectPath);

  // Ask which tools and features to include upfront
  const selectedTools = await askWhichToolToInclude();
  const selectedApps = await askServerorFrontendInclue();

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

async function askWhichToolToInclude() {
  const tools = await multiselect({
    message: 'Which configurations/linter tools would you like to set up?',
    options: [
      {
        value: 'prettier',
        label: 'Prettier',
        hint: 'Code formatter rules & auto-formatting script',
      },
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
      {
        value: 'husky',
        label: 'Husky',
        hint: 'Git pre-commit hooks setup (requires Git)',
      },
    ],
    required: false,
  });

  handleCancel(tools);
  return tools as string[];
}

async function askServerorFrontendInclue() {
  const apps = await multiselect({
    message: 'Which backend/frontend applications would you like to set up?',
    options: [
      {
        value: 'server',
        label: 'Express.js Backend',
        hint: 'Scaffold Express backend in apps/server',
      },
      {
        value: 'web',
        label: 'Frontend Web App',
        hint: 'Scaffold Next.js or React (Vite) frontend in apps/web',
      },
    ],
    required: false,
  });

  handleCancel(apps);
  return apps as string[];
}
