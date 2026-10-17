import type { DeploymentOptions } from '../types.js';
import { setupDockerDeployment } from './docker/index.js';
import { setupVercelDeployment } from './vercel/index.js';

export async function setupServerDeployment(options: DeploymentOptions) {
  if (options.target === 'docker') {
    await setupDockerDeployment(options);
  } else if (options.target === 'vercel') {
    await setupVercelDeployment(options);
  }
}

export * from './docker/index.js';
export * from './vercel/index.js';
