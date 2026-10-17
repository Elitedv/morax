import type { EnvSetupOptions } from '../types.js';

export function renderDbEnvTemplate(options: EnvSetupOptions): string {
  const { dbDialect } = options;

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
    '// Strict database environment schema',
    'export const dbSchema = z.object({',
    schemaFields.join('\n'),
    '});',
    '',
    'function formatDbErrors(errors: z.ZodError): string {',
    '  const issues = errors.issues',
    "    .map((issue) => `  ✖ [${issue.path.join('.')}]: ${issue.message}`)",
    "    .join('\\n');",
    '  return `\\n🚨 [Database Environment Validation Error] Invalid or missing database environment variables:\\n${issues}\\n`;',
    '}',
    '',
    "const isSkip = process.env.SKIP_ENV_VALIDATION === 'true';",
    'const parsed = dbSchema.safeParse(process.env);',
    '',
    'if (!parsed.success && !isSkip) {',
    '  console.error(formatDbErrors(parsed.error));',
    "  throw new Error('Database environment variable validation failed.');",
    '}',
    '',
    'export const env = (isSkip ? ({} as z.infer<typeof dbSchema>) : parsed.data)!;',
    'export type DbEnv = z.infer<typeof dbSchema>;',
    '',
  ].join('\n');
}
