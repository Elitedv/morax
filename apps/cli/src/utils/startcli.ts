import gradient from 'gradient-string';
import pc from 'picocolors';
import { intro } from '@clack/prompts';
import boxen from 'boxen';

const asciiArt = [
  '███╗   ███╗   ██████╗   ██████╗     █████╗   ██╗  ██╗',
  '████╗ ████║  ██╔═══██╗  ██╔══██╗   ██╔══██╗  ╚██╗██╔╝',
  '██╔████╔██║  ██║   ██║  ██████╔╝   ███████║   ╚███╔╝ ',
  '██║╚██╔╝██║  ██║   ██║  ██╔══██╗   ██╔══██║   ██╔██╗ ',
  '██║ ╚═╝ ██║  ╚██████╔╝  ██║  ██║   ██║  ██║  ██╔╝ ██╗',
  '╚═╝     ╚═╝   ╚═════╝   ╚═╝  ╚═╝   ╚═╝  ╚═╝  ╚═╝  ╚═╝',
].join('\n');

export function startCli() {
  console.clear();

  // Custom neon purple-to-cyan theme gradient
  const moraxGradient = gradient(['#8A2BE2', '#a12bef', '#00FFFF']);

  console.log('\n');
  console.log(moraxGradient(asciiArt));
  console.log('\n');

  intro(pc.magenta('Welcome to Morax — The Next-Gen Workspace Scaffolder'));

  console.log(
    boxen(
      `⚡ ${pc.bold('Morax')} automates the setup of modern ${pc.cyan('pnpm workspaces')}, linking internal shared configurations, UI packages, and framework apps concurrently`,
      {
        padding: 1,
        margin: { top: 0, bottom: 1, left: 1, right: 1 },
        borderStyle: 'round',
        borderColor: 'magenta',
        title: pc.magenta(' Morax CLI '),
        titleAlignment: 'left',
      },
    ),
  );
}
