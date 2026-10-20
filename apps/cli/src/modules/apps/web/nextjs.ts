import { confirm } from '@clack/prompts';
import pc from 'picocolors';
import handleCancel from '../../../utils/isCancel.js';
import fsPromises from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';

export async function promptNextjs() {
  return await confirm({
    message: 'Do you want to setup a Next.js frontend in apps/web?',
    initialValue: true,
  });
}

function runInteractiveCommand(
  command: string,
  args: string[],
  cwd: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const fullCommand =
      args.length > 0 ? `${command} ${args.join(' ')}` : command;
    const child = spawn(fullCommand, [], {
      cwd,
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, NODE_NO_WARNINGS: '1' },
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command "${fullCommand}" exited with code ${code}`));
      }
    });

    child.on('error', (err) => {
      reject(err);
    });
  });
}

export async function setupNextjs(projectPath: string, isMonorepo = true) {
  const appsDir = isMonorepo
    ? path.join(projectPath, 'apps')
    : path.dirname(projectPath);
  const targetName = isMonorepo ? 'web' : path.basename(projectPath);
  const webDir = path.join(appsDir, targetName);

  // 1. Delete the existing directory if it contains placeholder files (.gitkeep)
  try {
    await fsPromises.rm(webDir, { recursive: true, force: true });
  } catch {}

  // 2. Run pnpm dlx create-next-app@latest interactively!
  console.log(pc.cyan('\nStarting interactive Next.js application setup...'));
  await runInteractiveCommand(
    'pnpm',
    ['dlx', 'create-next-app@latest', targetName],
    appsDir,
  );

  // Clean up any inner .git directory if created in monorepo apps/web
  if (isMonorepo) {
    try {
      await fsPromises.rm(path.join(webDir, '.git'), {
        recursive: true,
        force: true,
      });
    } catch {}
  }

  // 3. Rename package name to "web" in apps/web/package.json if monorepo, or configure standalone pnpm
  const webPkgPath = path.join(webDir, 'package.json');
  try {
    const webPkgRaw = await fsPromises.readFile(webPkgPath, 'utf8');
    const webPkg = JSON.parse(webPkgRaw);
    if (isMonorepo) {
      webPkg.name = 'web';
    } else {
      webPkg.pnpm = {
        ...(webPkg.pnpm || {}),
        onlyBuiltDependencies: ['sharp'],
      };
    }
    await fsPromises.writeFile(
      webPkgPath,
      JSON.stringify(webPkg, null, 2),
      'utf8',
    );
  } catch {}
  return webDir;
}

export async function runNextjsSetup(projectPath: string, isMonorepo = true) {
  // Ensure the apps folder exists before proceeding (if monorepo)
  if (isMonorepo) {
    const appsDir = path.join(projectPath, 'apps');
    try {
      await fsPromises.access(appsDir);
    } catch {
      return;
    }
  }

  const nextPrompt = await promptNextjs();

  handleCancel(nextPrompt);

  if (nextPrompt) {
    try {
      await setupNextjs(projectPath, isMonorepo);
      console.log(
        pc.green(
          isMonorepo
            ? '\n✔ Success: Next.js frontend application configured in apps/web\n'
            : '\n✔ Success: Next.js frontend application configured at root\n',
        ),
      );
    } catch (error: any) {
      console.error(pc.red(`\n✖ Failed: Next.js application setup failed`));
      console.error(pc.red(`Error details: ${error.message || error}\n`));
      process.exit(1);
    }
  }
}
