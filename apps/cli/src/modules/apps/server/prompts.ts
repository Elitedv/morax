import { select } from '@clack/prompts';
import handleCancel from '../../../utils/isCancel.js';
import type { ServerFramework, ServerDeploymentTarget } from './types.js';

export async function promptServerFramework(): Promise<ServerFramework> {
  const framework = await select({
    message: 'Which backend framework would you like to setup in apps/server?',
    options: [
      {
        value: 'express',
        label: 'Express',
        hint: 'Minimalist & flexible',
      },
      {
        value: 'hono',
        label: 'Hono',
        hint: 'Web-standards & fast',
      },
      {
        value: 'none',
        label: 'None',
        hint: 'Skip',
      },
    ],
    initialValue: 'express',
  });

  handleCancel(framework);
  return framework as ServerFramework;
}

export async function promptServerDeployment(
  framework: 'express' | 'hono',
): Promise<ServerDeploymentTarget> {
  const frameworkLabel = framework === 'express' ? 'Express' : 'Hono';
  const target = await select({
    message: `Which deployment configuration would you like to set up for ${frameworkLabel} backend?`,
    options: [
      {
        value: 'docker',
        label: 'Docker',
        hint: 'Dockerfile',
      },
      {
        value: 'vercel',
        label: 'Vercel',
        hint: 'Serverless',
      },
      {
        value: 'none',
        label: 'None',
        hint: 'Skip',
      },
    ],
    initialValue: 'docker',
  });

  handleCancel(target);
  return target as ServerDeploymentTarget;
}
