import fsPromises from 'fs/promises';
import path from 'path';

export interface DockerScriptsOptions {
  postgres?: boolean;
  redis?: boolean;
}

export async function setupDockerScripts(
  projectPath: string,
  options: DockerScriptsOptions = {},
) {
  const scriptsDir = path.join(projectPath, 'scripts');
  await fsPromises.mkdir(scriptsDir, { recursive: true });

  const hasPostgres = !!options.postgres;
  const hasRedis = !!options.redis;

  const validActions = ['infra-up', 'infra-down'];
  if (hasPostgres) {
    validActions.push('postgres-up', 'postgres-down');
  }
  if (hasRedis) {
    validActions.push('redis-up', 'redis-down');
  }

  const shellLines = [
    '#!/usr/bin/env bash',
    'set -euo pipefail',
    '',
    'COMPOSE="docker compose -f docker/docker-compose.yml"',
    '',
    'case "${1:-}" in',
    '  infra-up)',
    '    $COMPOSE --profile infra up -d',
    '    ;;',
    '  infra-down)',
    '    $COMPOSE --profile infra down',
    '    ;;',
  ];

  if (hasPostgres) {
    shellLines.push(
      '  postgres-up)',
      '    $COMPOSE --profile postgres up -d',
      '    ;;',
      '  postgres-down)',
      '    $COMPOSE --profile postgres down',
      '    ;;',
    );
  }

  if (hasRedis) {
    shellLines.push(
      '  redis-up)',
      '    $COMPOSE --profile redis up -d',
      '    ;;',
      '  redis-down)',
      '    $COMPOSE --profile redis down',
      '    ;;',
    );
  }

  shellLines.push(
    '  *)',
    `    echo "Usage: $0 {${validActions.join('|')}}"`,
    '    exit 1',
    '    ;;',
    'esac',
    '',
  );

  await fsPromises.writeFile(
    path.join(scriptsDir, 'command.sh'),
    shellLines.join('\n'),
    { encoding: 'utf8', mode: 0o755 },
  );
}
