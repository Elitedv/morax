import { exec } from 'child_process';
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
  if (!options.silent) {
    console.log(pc.cyan(`> ${command}`));
  }

  try {
    const { stdout, stderr } = await execAsync(command, {
      cwd: options.cwd,
      env: { ...process.env, NODE_NO_WARNINGS: '1' },
    });

    if (!options.silent) {
      if (stdout && stdout.trim()) {
        console.log(stdout.trim());
      }
      if (stderr && stderr.trim()) {
        console.log(pc.yellow(stderr.trim()));
      }
    }

    return { stdout, stderr };
  } catch (error: any) {
    if (!options.silent) {
      if (error.stdout && error.stdout.trim()) {
        console.log(error.stdout.trim());
      }
      if (error.stderr && error.stderr.trim()) {
        console.error(pc.red(error.stderr.trim()));
      }
    }
    throw error;
  }
}
