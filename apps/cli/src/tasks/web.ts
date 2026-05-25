import { confirm } from '@clack/prompts';
import pc from 'picocolors';
import handleCancel from '../utils/isCancel.js';
import fsPromises from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';

export async function promptWeb() {
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
    const child = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      shell: true,
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(
          new Error(
            `Command "${command} ${args.join(' ')}" exited with code ${code}`,
          ),
        );
      }
    });

    child.on('error', (err) => {
      reject(err);
    });
  });
}

export async function setupWeb(projectPath: string) {
  const appsDir = path.join(projectPath, 'apps');
  const webDir = path.join(appsDir, 'web');

  // 1. Delete the existing apps/web directory if it contains placeholder files (.gitkeep)
  try {
    await fsPromises.rm(webDir, { recursive: true, force: true });
  } catch {}

  // 2. Run npx create-next-app@latest interactively!
  console.log(pc.cyan('\nStarting interactive Next.js application setup...'));
  await runInteractiveCommand(
    'npx',
    ['create-next-app@latest', 'web'],
    appsDir,
  );
}

export async function runWebSetup(projectPath: string) {
  // Ensure the apps folder option was generated/exists
  const appsDir = path.join(projectPath, 'apps');
  try {
    await fsPromises.access(appsDir);
  } catch {
    // If the apps folder was not scaffolded, we shouldn't attempt to setup Web there
    return;
  }

  const webPrompt = await promptWeb();

  handleCancel(webPrompt);

  if (webPrompt) {
    try {
      await setupWeb(projectPath);
      console.log(
        pc.green('\n✔ Success: Next.js frontend configured in apps/web\n'),
      );
    } catch (error: any) {
      console.error(pc.red(`\n✖ Failed: Next.js frontend setup failed`));
      console.error(pc.red(`Error details: ${error.message || error}\n`));
      process.exit(1);
    }
  }
}
