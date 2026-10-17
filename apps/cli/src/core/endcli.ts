import pc from 'picocolors';
import { outro } from '@clack/prompts';

export function endCli(
  name: string,
  projectPath: string,
  options: {
    hasDb?: boolean;
    orm?: 'drizzle' | 'none';
    hasDocker?: boolean;
    hasDockerScripts?: boolean;
    dockerServices?: { postgres?: boolean; redis?: boolean };
  } = {},
) {
  // Complete and show beautiful finish screen
  outro(pc.yellow('Morax scaffolding completed successfully!'));

  let instructions =
    `⚡ ${pc.bold('Workspace ready:')} ${pc.yellow(name)}\n` +
    `${pc.bold('To start developing:')}\n` +
    ` 1. ${pc.cyan(`cd ${name}`)}\n` +
    ` 2. ${pc.cyan('pnpm dev')}`;

  if (options.hasDocker) {
    if (options.hasDockerScripts) {
      instructions +=
        `\n\n${pc.bold('Docker Infrastructure (Runner scripts):')}\n` +
        ` • Start all:       ${pc.cyan('pnpm docker:up')}\n` +
        ` • Stop all:        ${pc.cyan('pnpm docker:down')}`;
      if (options.dockerServices?.postgres) {
        instructions += `\n • Start Postgres:  ${pc.cyan('pnpm docker db')}`;
      }
      if (options.dockerServices?.redis) {
        instructions += `\n • Start Redis:     ${pc.cyan('pnpm docker redis')}`;
      }
    } else {
      instructions +=
        `\n\n${pc.bold('Docker Infrastructure:')}\n` +
        ` • Start all:       ${pc.cyan('docker compose --env-file .env -f docker/docker-compose.yml up -d')}\n` +
        ` • Stop all:        ${pc.cyan('docker compose --env-file .env -f docker/docker-compose.yml down')}`;
      if (options.dockerServices?.postgres) {
        instructions += `\n • Start Postgres:  ${pc.cyan('docker compose --env-file .env -f docker/docker-compose.yml --profile postgres up -d')}`;
      }
      if (options.dockerServices?.redis) {
        instructions += `\n • Start Redis:     ${pc.cyan('docker compose --env-file .env -f docker/docker-compose.yml --profile redis up -d')}`;
      }
    }
  }

  if (options.hasDb && options.orm === 'drizzle') {
    instructions +=
      `\n\n${pc.bold('Database commands (packages/db - Drizzle ORM):')}\n` +
      ` • Push schema:    ${pc.cyan('pnpm --filter @repo/db db:push')}\n` +
      ` • Seed database:  ${pc.cyan('pnpm --filter @repo/db db:seed')}\n` +
      ` • Drizzle Studio: ${pc.cyan('pnpm --filter @repo/db db:studio')}\n` +
      ` • Generate SQL:   ${pc.cyan('pnpm --filter @repo/db db:generate')}`;
  }

  console.log(instructions);
}
