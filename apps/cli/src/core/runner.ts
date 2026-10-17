import path from 'path';
import { spinner } from '@clack/prompts';
import pc from 'picocolors';

import { startCli } from './startcli.js';
import {
  runPreflightChecks,
  checkTargetDirectory,
  checkBunAvailable,
} from './preflight.js';
import { promptWorkspaceName } from './workspaceName.js';
import {
  askLinter,
  askFormatter,
  askGitHooks,
  askRedis,
  askServerRuntime,
} from './prompts.js';
import { endCli } from './endcli.js';
import { runCommand } from '../utils/exec.js';

import { runReactScaffolder } from '../standalone/react-runner.js';
import { runNextScaffolder } from '../standalone/next-runner.js';

import { makeDirectories } from '../modules/workspace/directories.js';
import { setupReadme } from '../modules/workspace/readme.js';
import { setupRootEnv } from '../modules/workspace/env.js';
import { runGitSetup } from '../modules/git/git.js';
import { runHuskySetup } from '../modules/git/husky.js';
import { runLefthookSetup } from '../modules/git/lefthook.js';
import { runBiomeSetup } from '../modules/quality/biome.js';
import { runOxlintSetup } from '../modules/quality/oxlint.js';
import { runPrettierSetup } from '../modules/quality/prettier.js';
import { runTypescriptSetup } from '../modules/packages/typescript.js';
import {
  runDatabaseSetup,
  promptDatabase,
} from '../modules/packages/db/index.js';
import {
  runServerSetup,
  promptServerFramework,
  promptServerDeployment,
  setupServerDeployment,
} from '../modules/apps/server/index.js';
import { addWeb } from '../modules/apps/web/index.js';
import { runEnvSetup, promptEnv } from '../modules/packages/env/index.js';
import { setupDocker } from '../modules/docker/index.js';
import type { GitHookType, ServerRuntime } from '../types/index.js';

export async function runWorkspaceScaffolder(
  options: { react?: boolean; next?: boolean } = {},
) {
  // 1. Greet and display premium logo
  startCli();

  // 2. Preflight checks (Enforce Node.js v22+ and check tools)
  await runPreflightChecks();

  const isMonorepo = !options.react && !options.next;

  // 3. Prompt for Name (Optional, defaults to morax-workspace or my-app)
  const name = await promptWorkspaceName(isMonorepo);
  const projectPath = path.join(process.cwd(), name);

  // 4. Verify target directory is clean and available
  await checkTargetDirectory(projectPath, name);

  if (options.react) {
    await runReactScaffolder(name, projectPath);
    return;
  }

  if (options.next) {
    await runNextScaffolder(name, projectPath);
    return;
  }

  // 5. Initialize workspace folders and pnpm-workspace.yaml
  await makeDirectories(name, projectPath);

  // 6. Prompt and execute Git initialization
  const gitInitialized = await runGitSetup(projectPath);

  // =========================================================================
  // STEP 1: Code Quality & Linting (Ask -> Setup)
  // =========================================================================
  const linter = await askLinter();
  const formatter = await askFormatter();

  let gitHook: GitHookType = 'none';
  if (gitInitialized) {
    gitHook = await askGitHooks();
  }

  // Execute Biome setup if Biome was chosen for either linting or formatting
  if (linter === 'biome' || formatter === 'biome') {
    await runBiomeSetup(projectPath, {
      linter: linter === 'biome',
      formatter: formatter === 'biome',
    });
  }

  // Execute Oxlint setup if selected
  if (linter === 'oxlint') {
    await runOxlintSetup(projectPath);
  }

  // Execute Prettier setup if selected
  if (formatter === 'prettier') {
    await runPrettierSetup(projectPath);
  }

  // Execute Git hooks setup (Lefthook or Husky)
  if (gitHook === 'lefthook') {
    await runLefthookSetup(
      projectPath,
      gitInitialized,
      formatter !== 'none',
      linter !== 'none',
    );
  } else if (gitHook === 'husky') {
    await runHuskySetup(projectPath, gitInitialized);
  }

  // Execute modular TypeScript setup in packages/typescript
  await runTypescriptSetup(projectPath);

  // =========================================================================
  // STEP 2: Database Layer (Ask -> Setup)
  // =========================================================================
  const dbConfig = await promptDatabase();
  const setupRedis = await askRedis();

  if (dbConfig.orm !== 'none') {
    await runDatabaseSetup(projectPath, dbConfig, linter);
  }

  // Setup root Docker infrastructure if Postgres (Docker) or Redis is selected
  const isPostgresDocker =
    dbConfig.orm === 'drizzle' &&
    dbConfig.dialect === 'postgresql' &&
    dbConfig.postgresProvider === 'docker';

  if (isPostgresDocker || setupRedis) {
    await setupDocker(projectPath, {
      projectName: name,
      postgres: isPostgresDocker,
      redis: setupRedis,
    });
  }

  // =========================================================================
  // STEP 3: Backend Server (Ask -> Setup)
  // =========================================================================
  const serverFramework = await promptServerFramework();
  let serverRuntime: ServerRuntime = 'node';
  if (serverFramework !== 'none') {
    serverRuntime = await askServerRuntime();
    if (serverRuntime === 'bun') {
      await checkBunAvailable();
    }
    await runServerSetup(
      projectPath,
      serverFramework,
      linter,
      dbConfig.orm,
      serverRuntime,
    );

    // Server Deployment Configuration (apps/server)
    const deployTarget = await promptServerDeployment(serverFramework);
    if (deployTarget !== 'none') {
      await setupServerDeployment({
        projectPath,
        framework: serverFramework,
        runtime: serverRuntime,
        target: deployTarget,
      });
    }
  }

  // =========================================================================
  // STEP 4: Frontend Web Application (Ask -> Setup)
  // =========================================================================
  const webFramework = await addWeb(projectPath);

  // =========================================================================
  // STEP 5: Root Environment Configuration (.env, .env.example)
  // =========================================================================
  await setupRootEnv(projectPath, {
    db: dbConfig,
    redis: setupRedis,
    hasServer: serverFramework !== 'none',
    webFramework,
  });

  // =========================================================================
  // STEP 6: Type-Safe Environment Package (@repo/env) (Optional)
  // =========================================================================
  const shouldSetupEnv = await promptEnv();
  if (shouldSetupEnv) {
    await runEnvSetup(projectPath, {
      projectPath,
      hasDb: dbConfig.orm !== 'none',
      dbDialect: dbConfig.dialect,
      postgresProvider: dbConfig.postgresProvider,
      hasDocker: isPostgresDocker || setupRedis,
      hasRedis: setupRedis,
      hasServer: serverFramework !== 'none',
      webFramework,
    });
  }

  await setupReadme(projectPath, name, {
    hasDb: dbConfig.orm !== 'none',
    orm: dbConfig.orm,
    hasDocker: isPostgresDocker || setupRedis,
    dockerServices: {
      postgres: isPostgresDocker,
      redis: setupRedis,
    },
  });

  // Final pnpm install to resolve all workspace packages, symlinks & dependencies
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

  // Complete and show finish screen
  endCli(name, projectPath, {
    hasDb: dbConfig.orm !== 'none',
    orm: dbConfig.orm,
    hasDocker: isPostgresDocker || setupRedis,
    dockerServices: {
      postgres: isPostgresDocker,
      redis: setupRedis,
    },
  });
}
