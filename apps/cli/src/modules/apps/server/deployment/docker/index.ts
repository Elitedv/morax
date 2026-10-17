import path from 'path';
import { spinner } from '@clack/prompts';
import pc from 'picocolors';
import type { DeploymentOptions } from '../../types.js';
import { setupExpressDocker } from './express-docker.js';
import { setupHonoDocker } from './hono-docker.js';

export async function setupDockerDeployment(options: DeploymentOptions) {
  const { projectPath, framework, runtime } = options;
  const serverDir = path.join(projectPath, 'apps', 'server');
  const frameworkLabel = framework === 'express' ? 'Express' : 'Hono';
  const runtimeLabel = runtime === 'bun' ? 'Bun' : 'Node.js';

  const s = spinner();
  s.start(
    `Configuring Docker deployment for ${frameworkLabel} (${runtimeLabel}) in apps/server...`,
  );

  try {
    if (framework === 'express') {
      await setupExpressDocker(serverDir, runtime);
    } else {
      await setupHonoDocker(serverDir, runtime);
    }

    s.stop(
      pc.green(
        `✔ Success: Dockerfile and .dockerignore configured for ${frameworkLabel} (${runtimeLabel}) in apps/server`,
      ),
    );
  } catch (error: any) {
    s.stop(pc.red(`✖ Failed: Docker configuration failed: ${error.message}`));
    throw error;
  }
}
