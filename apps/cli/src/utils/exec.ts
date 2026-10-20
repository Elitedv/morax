import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import pc from 'picocolors';

const execAsync = promisify(exec);

export interface RunCommandOptions {
  cwd?: string;
  silent?: boolean;
}

/**
 * Reusable helper to execute commands and print/return their outputs
 */
export async function runCommand(
  command: string,
  options: RunCommandOptions = {},
) {
  const isSilent = options.silent ?? true;

  if (!isSilent) {
    console.log(pc.cyan(`> ${command}`));
  }

  try {
    const { stdout, stderr } = await execAsync(command, {
      cwd: options.cwd,
      env: {
        ...process.env,
        NODE_NO_WARNINGS: '1',
        NODE_OPTIONS:
          `${process.env.NODE_OPTIONS || ''} --no-deprecation`.trim(),
      },
    });

    if (!isSilent) {
      if (stdout && stdout.trim()) {
        console.log(stdout.trim());
      }
      if (stderr && stderr.trim()) {
        console.log(pc.yellow(stderr.trim()));
      }
    }

    return { stdout, stderr };
  } catch (error: any) {
    if (!isSilent) {
      if (error.stdout && error.stdout.trim()) {
        console.log(error.stdout.trim());
      }
      if (error.stderr && error.stderr.trim()) {
        console.error(pc.red(error.stderr.trim()));
      }
    } else if (error.stderr && error.stderr.trim()) {
      error.message = `${error.message}\n${error.stderr.trim()}`;
    }
    throw error;
  }
}

/**
 * Helper to run interactive commands with inherited stdio.
 * Note: Calling spawn(fullCommand, { shell: true }) without the args array
 * avoids Node.js 22+ DEP0190 deprecation warning.
 */
export function runInteractiveCommand(
  command: string,
  args: string[],
  cwd: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const fullCommand =
      args.length > 0 ? `${command} ${args.join(' ')}` : command;
    const child = spawn(fullCommand, {
      cwd,
      stdio: 'inherit',
      shell: true,
      env: {
        ...process.env,
        NODE_NO_WARNINGS: '1',
        NODE_OPTIONS:
          `${process.env.NODE_OPTIONS || ''} --no-deprecation`.trim(),
      },
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
