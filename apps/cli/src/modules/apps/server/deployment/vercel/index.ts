import path from 'path';
import { spinner } from '@clack/prompts';
import pc from 'picocolors';
import type { DeploymentOptions } from '../../types.js';
import { setupExpressVercel } from './express-vercel.js';
import { setupHonoVercel } from './hono-vercel.js';

export async function setupVercelDeployment(options: DeploymentOptions) {
  const { projectPath, framework, runtime } = options;
  const serverDir = path.join(projectPath, 'apps', 'server');
  const frameworkLabel = framework === 'express' ? 'Express' : 'Hono';

  const s = spinner();
  s.start(
    `Configuring Vercel deployment for ${frameworkLabel} backend in apps/server...`,
  );

  try {
    if (framework === 'express') {
      await setupExpressVercel(serverDir, runtime);
    } else {
      await setupHonoVercel(serverDir, runtime);
    }

    s.stop(
      pc.green(
        `✔ Success: vercel.json configured for ${frameworkLabel} in apps/server`,
      ),
    );
  } catch (error: any) {
    s.stop(pc.red(`✖ Failed: Vercel configuration failed: ${error.message}`));
    throw error;
  }
}
