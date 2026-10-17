import type {
  LinterType,
  OrmType,
  ServerFramework,
  ServerRuntime,
  ServerDeploymentTarget,
} from '../../../types/options.js';

export type { ServerFramework, ServerRuntime, ServerDeploymentTarget };

export interface ServerSetupOptions {
  projectPath: string;
  framework: 'express' | 'hono';
  runtime: ServerRuntime;
  linter?: LinterType;
  orm?: OrmType;
}

export interface DeploymentOptions {
  projectPath: string;
  framework: 'express' | 'hono';
  runtime: ServerRuntime;
  target: 'docker' | 'vercel';
}
