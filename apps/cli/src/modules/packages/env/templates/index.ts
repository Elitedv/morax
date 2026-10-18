import type { EnvSetupOptions } from '../types.js';

export function renderIndexEnvTemplate(options: EnvSetupOptions): string {
  const { hasServer, hasDb, hasDocker, hasAuth, webFramework } = options;
  const hasWebEnv = webFramework !== 'skip' || Boolean(hasAuth);

  const imports: string[] = [];
  const envProperties: string[] = [];

  if (hasServer) {
    imports.push("import { server } from './schema/server.js';");
    envProperties.push('  server,');
  }

  if (hasDb) {
    imports.push("import { db } from './schema/db.js';");
    envProperties.push('  db,');
  }

  if (hasDocker) {
    imports.push("import { docker } from './schema/docker.js';");
    envProperties.push('  docker,');
  }

  if (hasAuth) {
    imports.push("import { auth } from './schema/auth.js';");
    envProperties.push('  auth,');
  }

  if (hasWebEnv) {
    imports.push("import { web } from './schema/web.js';");
    envProperties.push('  web,');
  }

  return [...imports, '', 'export const env = {', ...envProperties, '};', '']
    .filter(Boolean)
    .join('\n');
}
