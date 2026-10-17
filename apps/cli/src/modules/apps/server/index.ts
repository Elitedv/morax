import fsPromises from 'fs/promises';
import path from 'path';
import { spinner } from '@clack/prompts';
import pc from 'picocolors';
import type {
  ServerFramework,
  ServerRuntime,
  ServerSetupOptions,
} from './types.js';
import { setupExpress } from './frameworks/express/index.js';
import { setupHono } from './frameworks/hono/index.js';

export * from './types.js';
export * from './prompts.js';
export * from './deployment/index.js';

export async function runServerSetup(
  projectPath: string,
  framework: 'express' | 'hono',
  linter: string = 'none',
  orm: 'drizzle' | 'none' = 'none',
  runtime: ServerRuntime = 'node',
) {
  // Ensure the apps folder exists
  const appsDir = path.join(projectPath, 'apps');
  try {
    await fsPromises.access(appsDir);
  } catch {
    return;
  }

  const frameworkLabel = framework === 'express' ? 'Express' : 'Hono';
  const runtimeLabel = runtime === 'bun' ? 'Bun' : 'Node.js';

  const s = spinner();
  s.start(
    `Setting up modular ${frameworkLabel} backend (${runtimeLabel}) in apps/server...`,
  );

  try {
    const options: ServerSetupOptions = {
      projectPath,
      framework,
      runtime,
      linter: linter as any,
      orm,
    };

    if (framework === 'express') {
      await setupExpress(options);
    } else {
      await setupHono(options);
    }

    s.stop(
      pc.green(
        `✔ Success: Modular ${frameworkLabel} backend (${runtimeLabel}) configured in apps/server`,
      ),
    );
  } catch (error: any) {
    s.stop(pc.red(`✖ Failed: ${frameworkLabel} backend setup failed`));
    console.error(pc.red(`\nError details: ${error.message || error}`));
    process.exit(1);
  }
}
