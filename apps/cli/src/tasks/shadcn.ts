import { confirm } from '@clack/prompts';
import pc from 'picocolors';
import handleCancel from '../utils/isCancel.js';
import fsPromises from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';

export async function promptShadcn() {
  return await confirm({
    message:
      'Do you want to setup shadcn UI in your Next.js website (apps/web)?',
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
      env: { ...process.env, NODE_NO_WARNINGS: '1' },
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

export async function setupShadcn(projectPath: string, isMonorepo = true) {
  const webDir = isMonorepo
    ? path.join(projectPath, 'apps', 'web')
    : projectPath;

  // Run pnpm dlx shadcn@latest init --template next interactively!
  console.log(pc.cyan('\nStarting interactive shadcn UI initialization...'));
  await runInteractiveCommand(
    'pnpm',
    ['dlx', 'shadcn@latest', 'init', '--template', 'next'],
    webDir,
  );
}

export async function runShadcnSetup(projectPath: string, isMonorepo = true) {
  // Ensure the Next.js frontend actually exists
  const webDir = isMonorepo
    ? path.join(projectPath, 'apps', 'web')
    : projectPath;
  try {
    await fsPromises.access(webDir);
  } catch {
    // Next.js app was not generated, skip shadcn setup
    return;
  }

  const shadcnPrompt = await promptShadcn();

  handleCancel(shadcnPrompt);

  if (shadcnPrompt) {
    try {
      await setupShadcn(projectPath, isMonorepo);
      console.log(
        pc.green(
          isMonorepo
            ? '\n✔ Success: shadcn UI successfully initialized in apps/web\n'
            : '\n✔ Success: shadcn UI successfully initialized at root\n',
        ),
      );
    } catch (error: any) {
      console.error(pc.red(`\n✖ Failed: shadcn UI setup failed`));
      console.error(pc.red(`Error details: ${error.message || error}\n`));
      process.exit(1);
    }
  }
}
