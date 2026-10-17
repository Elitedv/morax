import type { EnvSetupOptions } from '../types.js';

export function renderServerEnvTemplate(options: EnvSetupOptions): string {
  const { hasDb, dbDialect, hasRedis, hasServer } = options;

  const schemaFields: string[] = [
    "  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),",
  ];

  if (hasServer) {
    schemaFields.push(
      '  PORT: z.coerce.number({',
      "    required_error: 'PORT is required. Please declare PORT in root .env',",
      "    invalid_type_error: 'PORT must be a valid number',",
      '  }),',
      '  CORS_ORIGIN: z.string({',
      "    required_error: 'CORS_ORIGIN is required. Please declare CORS_ORIGIN in root .env',",
      "  }).default('http://localhost:5173'),",
    );
  }

  if (hasDb) {
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
  }

  if (hasRedis) {
    schemaFields.push(
      '  REDIS_PORT: z.coerce.number().default(6379),',
      '  REDIS_URL: z.string().optional(),',
    );
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
    '// Strict schema without silent fallbacks',
    'export const serverSchema = z.object({',
    schemaFields.join('\n'),
    '});',
    '',
    'function formatZodErrors(errors: z.ZodError): string {',
    '  const issues = errors.issues',
    "    .map((issue) => `  ✖ [${issue.path.join('.')}]: ${issue.message}`)",
    "    .join('\\n');",
    '  return `\\n🚨 [Environment Validation Error] Invalid or missing server environment variables:\\n${issues}\\n`;',
    '}',
    '',
    "const isSkip = process.env.SKIP_ENV_VALIDATION === 'true';",
    'const parsed = serverSchema.safeParse(process.env);',
    '',
    'if (!parsed.success && !isSkip) {',
    '  console.error(formatZodErrors(parsed.error));',
    "  throw new Error('Server environment variable validation failed.');",
    '}',
    '',
    'export const env = (isSkip ? ({} as z.infer<typeof serverSchema>) : parsed.data)!;',
    'export type ServerEnv = z.infer<typeof serverSchema>;',
    '',
  ].join('\n');
}
