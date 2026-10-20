import path from 'path';
import { spinner } from '@clack/prompts';
import pc from 'picocolors';
import { removeBunLockfiles } from '../utils/cleanBunLock.js';

import { setupNextjs } from '../modules/apps/web/nextjs.js';
import { runShadcnSetup } from '../modules/apps/web/shadcn.js';
import { runGitSetup } from '../modules/git/git.js';
import { setupReadme } from '../modules/workspace/readme.js';
import { endCli } from '../core/endcli.js';
import { runCommand } from '../utils/exec.js';

export async function runNextScaffolder(name: string, projectPath: string) {
  // 1. Setup Next.js directly at the root (non-monorepo)
  const finalProjectPath = await setupNextjs(projectPath, false);

  // 2. Setup shadcn UI (non-monorepo)
  await runShadcnSetup(finalProjectPath, false);

  // 3. Add the root README inside the created project folder
  await setupReadme(finalProjectPath, path.basename(finalProjectPath));

  // 4. Prompt and execute Git initialization inside the created project folder
  await runGitSetup(finalProjectPath);

  // 5. Sweep any stray bun lockfiles before final pnpm install
  await removeBunLockfiles(finalProjectPath);

  // 6. Run final pnpm install to ensure all dependencies are installed
  const installSpinner = spinner();
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

  // 6. Complete and show beautiful finish screen
  endCli(path.basename(finalProjectPath), finalProjectPath);
}
