import type { EnvSetupOptions } from '../types.js';

export function renderAuthEnvTemplate(options: EnvSetupOptions): string {
  return [
    "import { z } from 'zod';",
    "import { createEnv } from '../create-env.js';",
    '',
    '// Strict Better Auth environment schema',
    'export const authSchema = z.object({',
    '  BETTER_AUTH_SECRET: z.string({',
    "    required_error: 'BETTER_AUTH_SECRET is required. Please declare BETTER_AUTH_SECRET in root .env',",
    '  }),',
    "  BETTER_AUTH_URL: z.string().url().default('http://localhost:3001'),",
    '  CLIENT_URL: z.string().default(\'["http://localhost:5173", "http://localhost:3000"]\'),',
    '  COOKIE_DOMAIN: z.string().optional(),',
    '  GOOGLE_CLIENT_ID: z.string({',
    "    required_error: 'GOOGLE_CLIENT_ID is required. Please declare GOOGLE_CLIENT_ID in root .env',",
    "  }).default('google-client-id'),",
    '  GOOGLE_CLIENT_SECRET: z.string({',
    "    required_error: 'GOOGLE_CLIENT_SECRET is required. Please declare GOOGLE_CLIENT_SECRET in root .env',",
    "  }).default('google-client-secret'),",
    '  GITHUB_CLIENT_ID: z.string().optional(),',
    '  GITHUB_CLIENT_SECRET: z.string().optional(),',
    '});',
    '',
    "export const { env: auth, schema: authZodSchema } = createEnv('Auth', authSchema);",
    'export const env = auth;',
    'export type AuthEnv = z.infer<typeof authSchema>;',
    '',
  ].join('\n');
}
