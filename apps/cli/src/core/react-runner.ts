import path from 'path';
import { spinner } from '@clack/prompts';
import pc from 'picocolors';

import { setupReact } from '../tasks/react.js';
import { runGitSetup } from '../tasks/git.js';
import { setupReadme } from '../tasks/addreadme.js';
import { endCli } from './endcli.js';
import { runCommand } from '../utils/exec.js';

export async function runReactScaffolder(name: string, projectPath: string) {
  // 1. Setup React directly at the root (non-monorepo)
  const finalProjectPath = await setupReact(projectPath, false);

  // 2. Add the root README inside the created project folder
  await setupReadme(finalProjectPath, path.basename(finalProjectPath));

  // 3. Prompt and execute Git initialization inside the created project folder
  await runGitSetup(finalProjectPath);

  // 4. Run final pnpm install to ensure all dependencies are installed
  const installSpinner = spinner();
  console.log('\n');
  installSpinner.start('Running final package installation...');
  try {
    await runCommand('pnpm install', { cwd: finalProjectPath, silent: true });
    installSpinner.stop(
      pc.green('✔ Success: Dependencies configured successfully'),
    );
  } catch (error: any) {
    installSpinner.stop(pc.red('✖ Warning: Final package installation failed'));
    console.error(pc.red(`\nError details: ${error.message || error}`));
  }
  console.log('\n');

  // 5. Complete and show beautiful finish screen
  endCli(path.basename(finalProjectPath), finalProjectPath);
}
