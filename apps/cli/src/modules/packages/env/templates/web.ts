import type { EnvSetupOptions } from '../types.js';

export function renderWebEnvTemplate(options: EnvSetupOptions): string {
  const isNext = options.webFramework === 'nextjs';
  const varName = isNext ? 'NEXT_PUBLIC_API_URL' : 'VITE_API_URL';

  const clientValue = isNext
    ? `  ${varName}: process.env.${varName},`
    : `  ${varName}: typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.${varName} : process.env.${varName},`;

  return [
    "import { z } from 'zod';",
    '',
    '// Strict client schema without silent fallbacks',
    'export const webSchema = z.object({',
    `  ${varName}: z.string({`,
    `    required_error: '${varName} is required. Please declare ${varName} in root .env',`,
    `  }).url('${varName} must be a valid URL'),`,
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
    clientValue,
    '};',
    '',
    "const isSkip = typeof process !== 'undefined' && process.env?.SKIP_ENV_VALIDATION === 'true';",
    'const parsed = webSchema.safeParse(clientEnv);',
    '',
    'if (!parsed.success && !isSkip) {',
    '  console.error(formatWebErrors(parsed.error));',
    "  throw new Error('Client environment variable validation failed.');",
    '}',
    '',
    'export const env = (isSkip ? ({} as z.infer<typeof webSchema>) : parsed.data)!;',
    'export type WebEnv = z.infer<typeof webSchema>;',
    '',
  ].join('\n');
}
