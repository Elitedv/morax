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
        hint: 'Fast, unopinionated, minimalist web framework for Node & Bun',
      },
      {
        value: 'hono',
        label: 'Hono',
        hint: 'Ultrafast, lightweight, web-standards framework with first-class TypeScript',
      },
      {
        value: 'none',
        label: 'None',
        hint: 'Skip backend server setup',
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
        hint: 'Generate Dockerfile in apps/server for containerized deployment',
      },
      {
        value: 'vercel',
        label: 'Vercel',
        hint: 'Generate vercel.json in apps/server for serverless deployment',
      },
      {
        value: 'none',
        label: 'None',
        hint: 'Skip deployment configuration',
      },
    ],
    initialValue: 'docker',
  });

  handleCancel(target);
  return target as ServerDeploymentTarget;
}
