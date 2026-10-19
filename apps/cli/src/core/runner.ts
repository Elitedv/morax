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
import { promptAndSetupExtras } from '../modules/workspace/extras.js';
import { promptAndInstallSkills } from '../modules/skills/index.js';
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
import { promptAuth, setupAuth } from '../modules/packages/auth/index.js';
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

  // =========================================================================
  // STEP 1: Git Repository & Git Hooks (Ask -> Setup)
  // =========================================================================
  const gitInitialized = await runGitSetup(projectPath);

  let gitHook: GitHookType = 'none';
  if (gitInitialized) {
    gitHook = await askGitHooks();
    if (gitHook === 'husky') {
      await runHuskySetup(projectPath, gitInitialized);
    } else if (gitHook === 'lefthook') {
      await runLefthookSetup(projectPath, gitInitialized);
    }
  }

  // =========================================================================
  // STEP 2: Frontend Web Application (Ask -> Setup)
  // =========================================================================
  const webFramework = await addWeb(projectPath);

  // =========================================================================
  // STEP 3: Code Quality & Modular TypeScript (Ask -> Setup)
  // =========================================================================
  // Dynamically recommend Oxlint for React + Vite, Biome for Next.js
  const linter = await askLinter(webFramework);
  const formatter = await askFormatter(linter);

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

  // Execute modular TypeScript setup in packages/typescript
  await runTypescriptSetup(projectPath);

  // =========================================================================
  // STEP 4: Backend Server (Ask Framework, Runtime & Deployment)
  // =========================================================================
  const serverFramework = await promptServerFramework();
  let serverRuntime: ServerRuntime = 'node';
  let deployTarget = 'none';
  if (serverFramework !== 'none') {
    serverRuntime = await askServerRuntime();
    if (serverRuntime === 'bun') {
      await checkBunAvailable();
    }
    deployTarget = await promptServerDeployment(serverFramework);
  }

  // =========================================================================
  // STEP 5: Database & Docker Layer (Ask -> Setup)
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

  // If backend server is configured, execute server setup now with DB awareness
  if (serverFramework !== 'none') {
    await runServerSetup(
      projectPath,
      serverFramework,
      linter,
      dbConfig.orm,
      serverRuntime,
    );

    if (deployTarget !== 'none') {
      await setupServerDeployment({
        projectPath,
        framework: serverFramework,
        runtime: serverRuntime,
        target: deployTarget as any,
      });
    }
  }

  // =========================================================================
  // STEP 6: Environment & Authentication Packages (@repo/env & @repo/auth)
  // =========================================================================
  const shouldSetupEnv = await promptEnv();

  let shouldSetupAuth = false;
  if (dbConfig.orm === 'drizzle') {
    shouldSetupAuth = await promptAuth();
  }

  // Write root .env and .env.example
  await setupRootEnv(projectPath, {
    db: dbConfig,
    redis: setupRedis,
    hasServer: serverFramework !== 'none',
    hasAuth: shouldSetupAuth,
    webFramework,
  });

  // Setup type-safe environment package (@repo/env)
  if (shouldSetupEnv) {
    await runEnvSetup(projectPath, {
      projectPath,
      hasDb: dbConfig.orm !== 'none',
      dbDialect: dbConfig.dialect,
      postgresProvider: dbConfig.postgresProvider,
      hasDocker: isPostgresDocker || setupRedis,
      hasRedis: setupRedis,
      hasServer: serverFramework !== 'none',
      hasAuth: shouldSetupAuth,
      webFramework,
    });
  }

  // Setup Better Auth package (@repo/auth)
  if (shouldSetupAuth) {
    await setupAuth({
      projectPath,
      dialect: dbConfig.dialect,
      serverFramework,
      serverRuntime,
      webFramework,
      hasServer: serverFramework !== 'none',
      hasWeb: webFramework !== 'skip',
      hasEnv: shouldSetupEnv,
    });
  }

  // =========================================================================
  // STEP 7: Documentation, AI Agent Guidelines & License (Optional)
  // =========================================================================
  const extras = await promptAndSetupExtras(projectPath, {
    projectName: name,
    hasServer: serverFramework !== 'none',
    serverFramework: serverFramework !== 'none' ? serverFramework : undefined,
    serverRuntime: serverFramework !== 'none' ? serverRuntime : undefined,
    hasDb: dbConfig.orm !== 'none',
    orm: dbConfig.orm === 'drizzle' ? 'drizzle' : undefined,
    dbDialect: dbConfig.dialect,
    postgresProvider: dbConfig.postgresProvider,
    hasDocker: isPostgresDocker || setupRedis,
    dockerServices: {
      postgres: isPostgresDocker,
      redis: setupRedis,
    },
    hasRedis: setupRedis,
    webFramework,
    linter,
    formatter,
    hasEnv: shouldSetupEnv,
    hasAuth: shouldSetupAuth,
  });

  await setupReadme(projectPath, name, {
    hasDb: dbConfig.orm !== 'none',
    orm: dbConfig.orm,
    hasDocker: isPostgresDocker || setupRedis,
    hasDockerScripts: extras.hasScripts,
    hasAuth: shouldSetupAuth,
    dockerServices: {
      postgres: isPostgresDocker,
      redis: setupRedis,
    },
  });

  // =========================================================================
  // STEP 8: Curated AI Agent Skills (skills.sh) (Optional)
  // =========================================================================
  await promptAndInstallSkills(projectPath);

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
    hasDockerScripts: extras.hasScripts,
    dockerServices: {
      postgres: isPostgresDocker,
      redis: setupRedis,
    },
  });
}
