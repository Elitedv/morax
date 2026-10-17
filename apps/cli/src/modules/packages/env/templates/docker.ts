import type { EnvSetupOptions } from '../types.js';

export function renderDockerEnvTemplate(options: EnvSetupOptions): string {
  const { hasDb, dbDialect, postgresProvider, hasRedis } = options;

  const isPostgresDocker =
    hasDb &&
    dbDialect === 'postgresql' &&
    (!postgresProvider || postgresProvider === 'docker');

  const schemaFields: string[] = [];

  if (isPostgresDocker) {
    schemaFields.push(
      '  POSTGRES_USER: z.string({',
      "    required_error: 'POSTGRES_USER is required for Docker PostgreSQL. Please declare POSTGRES_USER in root .env',",
      "  }).min(1, 'POSTGRES_USER cannot be empty'),",
      '  POSTGRES_PASSWORD: z.string({',
      "    required_error: 'POSTGRES_PASSWORD is required for Docker PostgreSQL. Please declare POSTGRES_PASSWORD in root .env',",
      "  }).min(1, 'POSTGRES_PASSWORD cannot be empty'),",
      '  POSTGRES_DB: z.string({',
      "    required_error: 'POSTGRES_DB is required for Docker PostgreSQL. Please declare POSTGRES_DB in root .env',",
      "  }).min(1, 'POSTGRES_DB cannot be empty'),",
      '  POSTGRES_PORT: z.coerce.number({',
      "    required_error: 'POSTGRES_PORT is required for Docker PostgreSQL. Please declare POSTGRES_PORT in root .env',",
      "    invalid_type_error: 'POSTGRES_PORT must be a valid number',",
      '  }).default(5432),',
    );
  }

  if (hasRedis) {
    schemaFields.push(
      '  REDIS_PORT: z.coerce.number({',
      "    required_error: 'REDIS_PORT is required for Redis. Please declare REDIS_PORT in root .env',",
      "    invalid_type_error: 'REDIS_PORT must be a valid number',",
      '  }).default(6379),',
    );
  }

  if (schemaFields.length === 0) {
    schemaFields.push("  DOCKER_ENV: z.string().default('development'),");
  }

  return [
    "import { z } from 'zod';",
    "import { createEnv } from '../create-env.js';",
    '',
    '// Strict Docker infrastructure schema',
    "export const { env: docker, schema: dockerSchema } = createEnv('Docker Infrastructure', {",
    schemaFields.join('\n'),
    '});',
    '',
    'export const env = docker;',
    'export type DockerEnv = z.infer<typeof dockerSchema>;',
    '',
  ].join('\n');
}
