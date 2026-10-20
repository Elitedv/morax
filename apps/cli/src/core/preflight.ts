import ora from 'ora';
import pc from 'picocolors';
import fsPromises from 'fs/promises';
import { runCommand } from '../utils/exec.js';

export interface PreflightResult {
  nodeVersion: string;
  pnpmVersion: string;
  bunVersion: string | null;
  dockerVersion: string | null;
  gitVersion: string;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function runPreflightChecks(): Promise<PreflightResult> {
  const tick = pc.cyan('✔');
  const cross = pc.red('✖');
  const warn = pc.yellow('⚠');

  // 1. Initial header
  const headerSpinner = ora({
    text: 'Preflight checks.',
    color: 'cyan',
  }).start();
  await sleep(120);
  headerSpinner.stopAndPersist({
    symbol: tick,
    text: 'Preflight checks.',
  });

  // 2. Node.js check (Strictly enforce Node >= 22)
  const nodeSpinner = ora({
    text: 'Verifying Node.js version...',
    color: 'cyan',
  }).start();
  await sleep(150);

  const nodeVersion = process.version;
  const majorVersion = parseInt(process.versions.node.split('.')[0], 10);

  if (isNaN(majorVersion) || majorVersion < 22) {
    nodeSpinner.stopAndPersist({
      symbol: cross,
      text: `Verifying Node.js version. Found ${pc.red(nodeVersion)} (v22+ required).`,
    });
    console.log(
      '\n' +
        pc.red(`✖ Error: Node.js v22 or higher is required to run Morax.\n`) +
        pc.cyan(
          '  • Official installer: https://nodejs.org\n' +
            '  • Using nvm:          nvm install 22 && nvm use 22\n' +
            '  • Using fnm:          fnm install 22 && fnm use 22\n',
        ),
    );
    process.exit(1);
  }

  nodeSpinner.stopAndPersist({
    symbol: tick,
    text: `Verifying Node.js version. Found ${pc.cyan(nodeVersion)}.`,
  });

  // 3. pnpm check
  const pnpmSpinner = ora({
    text: 'Verifying pnpm installation...',
    color: 'cyan',
  }).start();
  await sleep(150);

  let pnpmVersion = '';
  try {
    const { stdout } = await runCommand('pnpm --version', { silent: true });
    pnpmVersion = stdout.trim();
    if (!pnpmVersion.startsWith('v')) {
      pnpmVersion = `v${pnpmVersion}`;
    }
    pnpmSpinner.stopAndPersist({
      symbol: tick,
      text: `Verifying pnpm version. Found ${pc.cyan(pnpmVersion)}.`,
    });
  } catch {
    pnpmSpinner.stopAndPersist({
      symbol: cross,
      text: 'Verifying pnpm version. Not found.',
    });
    console.log(
      '\n' +
        pc.red(
          '✖ Error: pnpm is required to create and manage Morax workspaces.\n',
        ) +
        pc.cyan('  • Install pnpm globally: npm install -g pnpm\n') +
        pc.dim('  • Documentation:         https://pnpm.io/installation\n'),
    );
    process.exit(1);
  }

  // 4. Bun check (Required)
  const bunSpinner = ora({
    text: 'Verifying Bun runtime...',
    color: 'cyan',
  }).start();
  await sleep(150);

  let bunVersion = '';
  try {
    const { stdout } = await runCommand('bun --version', { silent: true });
    bunVersion = stdout.trim();
    if (!bunVersion.startsWith('v')) {
      bunVersion = `v${bunVersion}`;
    }
    bunSpinner.stopAndPersist({
      symbol: tick,
      text: `Verifying Bun runtime. Found ${pc.cyan(bunVersion)}.`,
    });
  } catch {
    bunSpinner.stopAndPersist({
      symbol: cross,
      text: 'Verifying Bun runtime. Not found.',
    });
    console.log(
      '\n' +
        pc.red(
          '✖ Error: Bun is required to scaffold and execute high-performance Morax apps.\n',
        ) +
        pc.cyan('  • Install Bun:   https://bun.sh\n') +
        pc.cyan(
          '  • Windows:       powershell -c "irm bun.sh/install.ps1 | iex"\n',
        ) +
        pc.cyan(
          '  • macOS / Linux: curl -fsSL https://bun.sh/install | bash\n',
        ),
    );
    process.exit(1);
  }

  // 5. Docker check (Optional warning)
  const dockerSpinner = ora({
    text: 'Verifying Docker installation...',
    color: 'cyan',
  }).start();
  await sleep(150);

  let dockerVersion: string | null = null;
  try {
    const { stdout } = await runCommand('docker --version', { silent: true });
    const match = stdout.match(/\d+\.\d+\.\d+/);
    dockerVersion = match ? `v${match[0]}` : stdout.trim();
    dockerSpinner.stopAndPersist({
      symbol: tick,
      text: `Verifying Docker installation. Found ${pc.cyan(dockerVersion)}.`,
    });
  } catch {
    dockerSpinner.stopAndPersist({
      symbol: warn,
      text: `Verifying Docker installation. ${pc.yellow('Not found')} (optional).`,
    });
  }

  // 6. Git check (Optional)
  const gitSpinner = ora({
    text: 'Verifying Git installation...',
    color: 'cyan',
  }).start();
  await sleep(150);

  let gitVersion = '';
  try {
    const { stdout } = await runCommand('git --version', { silent: true });
    const match = stdout.match(/\d+\.\d+\.\d+/);
    gitVersion = match ? `v${match[0]}` : stdout.trim();
    gitSpinner.stopAndPersist({
      symbol: tick,
      text: `Verifying Git installation. Found ${pc.cyan(gitVersion)}.`,
    });
  } catch {
    gitSpinner.stopAndPersist({
      symbol: warn,
      text: `Verifying Git installation. ${pc.yellow('Not found')} (skipping Git features).`,
    });
  }

  console.log(''); // Clean spacing before prompts start

  return {
    nodeVersion,
    pnpmVersion,
    bunVersion,
    dockerVersion,
    gitVersion,
  };
}

export async function checkTargetDirectory(
  projectPath: string,
  name: string,
): Promise<void> {
  try {
    const files = await fsPromises.readdir(projectPath);
    if (files.length > 0) {
      console.log(
        '\n' +
          pc.red(
            `✖ Target directory "${name}" already exists and contains files.`,
          ) +
          '\n' +
          pc.cyan(
            '  Please choose a different workspace name or empty the directory.\n',
          ),
      );
      process.exit(1);
    }
  } catch {
    // Directory does not exist yet; safe to proceed
  }
}

export async function checkBunAvailable(): Promise<boolean> {
  try {
    await runCommand('bun --version', { silent: true });
    return true;
  } catch {
    console.log(
      '\n' +
        pc.yellow(
          '⚠ Warning: Bun is required to run "pnpm dev" in apps/server.\n',
        ) +
        pc.cyan(
          '  • Windows:       powershell -c "irm bun.sh/install.ps1 | iex"\n' +
            '  • macOS/Linux:   curl -fsSL https://bun.sh/install | bash\n' +
            '  • Documentation: https://bun.sh\n',
        ),
    );
    return false;
  }
}
