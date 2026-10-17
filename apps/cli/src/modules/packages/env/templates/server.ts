import type { EnvSetupOptions } from '../types.js';

export function renderServerEnvTemplate(options: EnvSetupOptions): string {
  const { hasRedis, hasServer, hasDocker } = options;

  const serverFields: string[] = [
    "  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),",
  ];

  if (hasServer) {
    serverFields.push(
      '  PORT: z.coerce.number({',
      "    required_error: 'PORT is required. Please declare PORT in root .env',",
      "    invalid_type_error: 'PORT must be a valid number',",
      '  }),',
      '  CORS_ORIGIN: z.string({',
      "    required_error: 'CORS_ORIGIN is required. Please declare CORS_ORIGIN in root .env',",
      "  }).default('http://localhost:5173'),",
    );
  }

  if (hasRedis) {
    serverFields.push(
      '  REDIS_PORT: z.coerce.number().default(6379),',
      '  REDIS_URL: z.string().optional(),',
    );
  }

  const dockerImport = hasDocker
    ? [
        '// Run Docker infrastructure validation whenever server environment is loaded',
        "import './docker.js';",
        '',
      ]
    : [];

  return [
    "import { z } from 'zod';",
    "import { createEnv } from '../create-env.js';",
    ...dockerImport,
    '// Strict server schema',
    'export const serverSchema = z.object({',
    serverFields.join('\n'),
    '});',
    '',
    "export const { env: server } = createEnv('Server', serverSchema);",
    'export const env = server;',
    'export type ServerEnv = z.infer<typeof serverSchema>;',
    '',
  ].join('\n');
}
