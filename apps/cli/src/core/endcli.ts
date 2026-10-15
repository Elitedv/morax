import pc from 'picocolors';
import { outro } from '@clack/prompts';

export function endCli(
  name: string,
  projectPath: string,
  options: { hasDb?: boolean; orm?: 'drizzle' | 'prisma' | 'none' } = {},
) {
  // Complete and show beautiful finish screen
  outro(pc.yellow('Morax scaffolding completed successfully!'));

  let instructions =
    `⚡ ${pc.bold('Workspace ready:')} ${pc.yellow(name)}\n` +
    `${pc.bold('To start developing:')}\n` +
    ` 1. ${pc.cyan(`cd ${name}`)}\n` +
    ` 2. ${pc.cyan('pnpm dev')}`;

  if (options.hasDb) {
    if (options.orm === 'prisma') {
      instructions +=
        `\n\n${pc.bold('Database commands (packages/db - Prisma ORM):')}\n` +
        ` • Generate client: ${pc.cyan('pnpm --filter @repo/db db:generate')}\n` +
        ` • Push schema:     ${pc.cyan('pnpm --filter @repo/db db:push')}\n` +
        ` • Prisma Studio:   ${pc.cyan('pnpm --filter @repo/db db:studio')}`;
    } else {
      instructions +=
        `\n\n${pc.bold('Database commands (packages/db - Drizzle ORM):')}\n` +
        ` • Push schema:    ${pc.cyan('pnpm --filter @repo/db db:push')}\n` +
        ` • Drizzle Studio: ${pc.cyan('pnpm --filter @repo/db db:studio')}\n` +
        ` • Generate SQL:   ${pc.cyan('pnpm --filter @repo/db db:generate')}`;
    }
  }

  console.log(instructions);
}
