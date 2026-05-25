import path from 'path';
import { spinner } from '@clack/prompts';
import pc from 'picocolors';

import { startCli } from './startcli.js';
import { promptWorkspaceName } from './workspaceName.js';
import { makeDirectories } from '../tasks/directories.js';
import { runPrettierSetup } from '../tasks/prettier.js';
import { runEslintSetup } from '../tasks/eslint.js';
import { runTypescriptSetup } from '../tasks/typescript.js';
import { runServerSetup } from '../tasks/server.js';
import { runWebSetup } from '../tasks/web.js';
import { runGitSetup } from '../tasks/git.js';
import { runHuskySetup } from '../tasks/husky.js';
import { endCli } from './endcli.js';
import { runCommand } from '../utils/exec.js';
import { setupReadme } from '../tasks/addreadme.js';

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

  // 5. Prompt and execute Prettier setup
  await runPrettierSetup(projectPath);

  // 6. Prompt and execute ESLint setup
  await runEslintSetup(projectPath);

  // 7. Prompt and execute TypeScript setup
  await runTypescriptSetup(projectPath);

  // 8. Prompt and execute Husky setup
  await runHuskySetup(projectPath, gitInitialized);

  // 9. Prompt and execute Express Backend setup
  await runServerSetup(projectPath);

  // 10. Prompt and execute Next.js Frontend setup
  await runWebSetup(projectPath);

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

  // 12. Complete and show beautiful finish screen
  endCli(name, projectPath);
}
