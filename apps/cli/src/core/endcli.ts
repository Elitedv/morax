import pc from 'picocolors';
import { outro } from '@clack/prompts';

export function endCli(name: string, projectPath: string) {
  // Complete and show beautiful finish screen
  outro(pc.yellow('Morax scaffolding completed successfully!'));

  console.log(
    `⚡ ${pc.bold('Workspace ready:')} ${pc.yellow(name)}\n` +
      // `Location: ${pc.cyan(projectPath)}\n\n` +
      `${pc.bold('To start developing:')}\n` +
      ` 1. ${pc.cyan(`cd ${name}`)}\n` +
      ` 2. ${pc.cyan('pnpm dev')}`,
  );
}
