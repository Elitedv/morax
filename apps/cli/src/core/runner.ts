import path from 'path';

import { startCli } from './startcli.js';
import { promptWorkspaceName } from './workspaceName.js';
import { makeDirectories } from '../tasks/directories.js';
import { runPrettierSetup } from '../tasks/prettier.js';
import { runGitSetup } from '../tasks/git.js';
import { runHuskySetup } from '../tasks/husky.js';
import { endCli } from './endcli.js';

export async function runWorkspaceScaffolder() {
  // 1. Greet and display premium logo
  startCli();

  // 2. Prompt for Name (Optional, defaults to morax-workspace)
  const name = await promptWorkspaceName();
  const projectPath = path.join(process.cwd(), name);

  // 3. Prompt and execute directories and workspace config generation
  await makeDirectories(name, projectPath);

  // 4. Prompt and execute Git initialization
  const gitInitialized = await runGitSetup(projectPath);

  // 5. Prompt and execute Prettier setup
  await runPrettierSetup(projectPath);

  // 6. Prompt and execute Husky setup
  await runHuskySetup(projectPath, gitInitialized);

  // 7. Complete and show beautiful finish screen
  endCli(name, projectPath);
}
