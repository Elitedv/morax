import type { EnvSetupOptions } from '../types.js';

export function renderCheckEnvTemplate(options: EnvSetupOptions): string {
  const { hasServer, hasDb, hasDocker, hasAuth, webFramework } = options;
  const hasWebEnv = webFramework !== 'skip' || Boolean(hasAuth);
  const imports: string[] = [];

  if (hasDocker) {
    imports.push("import './schema/docker.js';");
  }
  if (hasDb) {
    imports.push("import './schema/db.js';");
  }
  if (hasServer) {
    imports.push("import './schema/server.js';");
  }
  if (hasAuth) {
    imports.push("import './schema/auth.js';");
  }
  if (hasWebEnv) {
    imports.push("import './schema/web.js';");
  }

  return [
    '// Standalone CLI checker to validate all environment variables at once',
    '// Useful for pre-commit hooks, Docker build validation, and CI/CD pipelines',
    ...imports,
    '',
    "console.log('✔ All environment variables validated successfully!');",
    '',
  ].join('\n');
}
