import type { EnvSetupOptions } from '../types.js';

export function renderWebEnvTemplate(options: EnvSetupOptions): string {
  const isNext = options.webFramework === 'nextjs';
  const varName = isNext ? 'NEXT_PUBLIC_API_URL' : 'VITE_API_URL';

  return [
    "import { z } from 'zod';",
    '',
    '// Strict client schema without silent fallbacks',
    'export const webSchema = z.object({',
    `  ${varName}: z.string({`,
    `    required_error: '${varName} is required. Please declare ${varName} in root .env',`,
    `  }).url('${varName} must be a valid URL').default('http://localhost:3001'),`,
    '});',
    '',
    'function formatWebErrors(errors: z.ZodError): string {',
    '  const issues = errors.issues',
    "    .map((issue) => `  ✖ [${issue.path.join('.')}]: ${issue.message}`)",
    "    .join('\\n');",
    '  return `\\n🚨 [Client Environment Error] Missing or invalid public client variables:\\n${issues}\\n`;',
    '}',
    '',
    'const clientEnv = {',
    isNext
      ? `  ${varName}: process.env.${varName},`
      : `  ${varName}: (import.meta as any).env?.${varName} || process.env.${varName},`,
    '};',
    '',
    'const parsed = webSchema.safeParse(clientEnv);',
    '',
    'if (!parsed.success) {',
    '  console.error(formatWebErrors(parsed.error));',
    "  throw new Error('Client environment variable validation failed.');",
    '}',
    '',
    'export const env = parsed.data;',
    'export type WebEnv = z.infer<typeof webSchema>;',
    '',
  ].join('\n');
}
