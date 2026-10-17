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
    "import { config } from 'dotenv';",
    "import path from 'node:path';",
    "import { fileURLToPath } from 'node:url';",
    '',
    '// Resolve monorepo workspace directory',
    'const srcDir = path.dirname(fileURLToPath(import.meta.url));',
    "const workspaceRoot = path.resolve(srcDir, '../../..');",
    '',
    '// Load infrastructure credentials from root .env',
    "config({ path: path.join(workspaceRoot, '.env') });",
    '',
    '// Strict Docker infrastructure schema',
    'export const dockerSchema = z.object({',
    schemaFields.join('\n'),
    '});',
    '',
    'function formatDockerErrors(errors: z.ZodError): string {',
    '  const issues = errors.issues',
    "    .map((issue) => `  ✖ [${issue.path.join('.')}]: ${issue.message}`)",
    "    .join('\\n');",
    '  return `\\n🚨 [Docker Environment Validation Error] Invalid or missing Docker infrastructure variables:\\n${issues}\\n`;',
    '}',
    '',
    "const isSkip = process.env.SKIP_ENV_VALIDATION === 'true';",
    'const parsed = dockerSchema.safeParse(process.env);',
    '',
    'if (!parsed.success && !isSkip) {',
    '  console.error(formatDockerErrors(parsed.error));',
    "  throw new Error('Docker environment variable validation failed.');",
    '}',
    '',
    'export const env = (isSkip ? ({} as z.infer<typeof dockerSchema>) : parsed.data)!;',
    'export type DockerEnv = z.infer<typeof dockerSchema>;',
    '',
  ].join('\n');
}
