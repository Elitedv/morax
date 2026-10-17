import type { EnvSetupOptions } from '../types.js';

export function renderDbEnvTemplate(options: EnvSetupOptions): string {
  const { dbDialect, hasDocker, postgresProvider } = options;

  const schemaFields: string[] = [];

  if (dbDialect === 'sqlite') {
    schemaFields.push(
      '  DB_FILE_NAME: z.string({',
      "    required_error: 'DB_FILE_NAME is required. Please declare DB_FILE_NAME in root .env',",
      "  }).min(1, 'DB_FILE_NAME cannot be empty'),",
    );
  } else {
    schemaFields.push(
      '  DATABASE_URL: z.string({',
      "    required_error: 'DATABASE_URL is required. Please declare DATABASE_URL in root .env',",
      "  }).min(1, 'DATABASE_URL cannot be empty'),",
    );
  }

  const isPostgresDocker =
    hasDocker &&
    dbDialect === 'postgresql' &&
    (!postgresProvider || postgresProvider === 'docker');

  const dockerImport = isPostgresDocker
    ? [
        '// Run Docker infrastructure validation whenever database environment is loaded',
        "import './docker.js';",
        '',
      ]
    : [];

  return [
    "import { z } from 'zod';",
    "import { createEnv } from '../create-env.js';",
    ...dockerImport,
    '// Strict database environment schema',
    "export const { env: db, schema: dbSchema } = createEnv('Database', {",
    schemaFields.join('\n'),
    '});',
    '',
    'export const env = db;',
    'export type DbEnv = z.infer<typeof dbSchema>;',
    '',
  ].join('\n');
}
