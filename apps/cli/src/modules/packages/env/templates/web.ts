import type { EnvSetupOptions } from '../types.js';

export function renderWebEnvTemplate(options: EnvSetupOptions): string {
  const isNext = options.webFramework === 'nextjs';
  const isReact = options.webFramework === 'react';
  const hasAuth = Boolean(options.hasAuth);

  const fields: string[] = [];

  if (isNext) {
    fields.push(
      "  NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:3001'),",
    );
    if (hasAuth) {
      fields.push(
        "  NEXT_PUBLIC_BETTER_AUTH_URL: z.string().url().default('http://localhost:3001'),",
      );
    }
    fields.push('  WEB_PORT: z.coerce.number().default(3000),');
  } else if (isReact) {
    fields.push(
      "  VITE_BACKEND_URL: z.string().url().default('http://localhost:3001'),",
    );
    if (hasAuth) {
      fields.push(
        "  NEXT_PUBLIC_BETTER_AUTH_URL: z.string().url().default('http://localhost:3001'),",
      );
    }
    fields.push('  WEB_PORT: z.coerce.number().default(5173),');
  } else {
    // webFramework === 'skip' but web env requested (e.g. auth is configured)
    fields.push(
      "  VITE_BACKEND_URL: z.string().url().default('http://localhost:3001'),",
    );
    fields.push(
      "  NEXT_PUBLIC_BETTER_AUTH_URL: z.string().url().default('http://localhost:3001'),",
    );
    fields.push('  WEB_PORT: z.coerce.number().default(3000),');
  }

  return [
    "import { z } from 'zod';",
    "import { createEnv } from '../create-env.js';",
    '',
    '// Web environment schema (frontend web apps)',
    'export const webSchema = z.object({',
    ...fields,
    '});',
    '',
    "export const { env: web, schema: webZodSchema } = createEnv('Web', webSchema);",
    'export const env = web;',
    'export type WebEnv = z.infer<typeof webSchema>;',
    '',
  ].join('\n');
}
