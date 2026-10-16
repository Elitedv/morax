import path from 'path';
import { spinner } from '@clack/prompts';
import pc from 'picocolors';

import { startCli } from './startcli.js';
import { promptWorkspaceName } from './workspaceName.js';
import { gatherWorkspaceAnswers } from './prompts.js';
import { endCli } from './endcli.js';
import { runCommand } from '../utils/exec.js';

import { runReactScaffolder } from '../standalone/react-runner.js';
import { runNextScaffolder } from '../standalone/next-runner.js';

import { makeDirectories } from '../modules/workspace/directories.js';
import { setupReadme } from '../modules/workspace/readme.js';
import { runGitSetup } from '../modules/git/git.js';
import { runHuskySetup } from '../modules/git/husky.js';
import { runLefthookSetup } from '../modules/git/lefthook.js';
import { runBiomeSetup } from '../modules/quality/biome.js';
import { runOxlintSetup } from '../modules/quality/oxlint.js';
import { runPrettierSetup } from '../modules/quality/prettier.js';
import { runTypescriptSetup } from '../modules/packages/typescript.js';
import { runDatabaseSetup } from '../modules/packages/db/index.js';
import { runServerSetup } from '../modules/apps/server/index.js';
import { addWeb } from '../modules/apps/web/index.js';

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

  // 4. Prompt and execute Git initialization
  const gitInitialized = await runGitSetup(projectPath);

  // 5. Gather all workspace configuration choices interactively
  const answers = await gatherWorkspaceAnswers(
    name,
    projectPath,
    gitInitialized,
  );

  // 6. Execute Biome setup if Biome was chosen for either linting or formatting
  if (answers.linter === 'biome' || answers.formatter === 'biome') {
    await runBiomeSetup(projectPath, {
      linter: answers.linter === 'biome',
      formatter: answers.formatter === 'biome',
    });
  }

  // 7. Execute Oxlint setup if selected
  if (answers.linter === 'oxlint') {
    await runOxlintSetup(projectPath);
  }

  // 8. Execute Prettier setup if selected
  if (answers.formatter === 'prettier') {
    await runPrettierSetup(projectPath);
  }

  // 9. Execute Git hooks setup (Lefthook or Husky)
  if (answers.gitHook === 'lefthook') {
    await runLefthookSetup(
      projectPath,
      gitInitialized,
      answers.formatter !== 'none',
      answers.linter !== 'none',
    );
  } else if (answers.gitHook === 'husky') {
    await runHuskySetup(projectPath, gitInitialized);
  }

  // 10. Execute TypeScript setup if selected
  if (answers.includeTypescript) {
    await runTypescriptSetup(projectPath);
  }

  // 11. Execute Database setup (Drizzle ORM) in packages/db if selected
  if (answers.db.orm !== 'none') {
    await runDatabaseSetup(projectPath, answers.db, answers.linter);
  }

  // 12. Execute Express Backend setup if selected
  if (answers.selectedApps.includes('server')) {
    await runServerSetup(
      projectPath,
      answers.linter,
      answers.db.orm,
      answers.serverRuntime || 'node',
    );
  }

  // 13. Execute Next.js/Vite Frontend setup if selected
  if (answers.selectedApps.includes('web')) {
    await addWeb(projectPath);
  }

  // 14. Add the root README with configured packages/apps
  await setupReadme(projectPath, name, {
    hasDb: answers.db.orm !== 'none',
    orm: answers.db.orm,
  });

  // 15. Run final pnpm install to resolve all workspace configurations and symlinks
  const s = spinner();
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

  // 16. Complete and show beautiful finish screen
  endCli(name, projectPath, {
    hasDb: answers.db.orm !== 'none',
    orm: answers.db.orm,
  });
}
