import pc from 'picocolors';
import { outro } from '@clack/prompts';
import boxen from 'boxen';

export function endCli(name: string, projectPath: string) {
  // Complete and show beautiful finish screen
  outro(pc.yellow('Morax scaffolding completed successfully!'));

  console.log(
    boxen(
      `⚡ ${pc.bold('Workspace ready:')} ${pc.yellow(name)}\n` +
        `Location: ${pc.cyan(projectPath)}\n\n` +
        `${pc.bold('To start developing:')}\n` +
        ` 1. ${pc.cyan(`cd ${name}`)}\n` +
        ` 2. ${pc.cyan('pnpm dev')}\n\n` +
        `💡 Code formatting & git orchestration is fully active.`,
      {
        padding: 0,
        margin: 0,
        borderStyle: 'round',
        borderColor: 'yellow',
        title: pc.black(pc.bold(' Setup Complete ')),
        titleAlignment: 'center',
      },
    ),
  );
}
