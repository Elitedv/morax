import type { EnvSetupOptions } from '../types.js';

export function renderIndexEnvTemplate(options: EnvSetupOptions): string {
  const { hasServer, hasDb, hasDocker, webFramework } = options;

  const imports: string[] = [];
  const envProperties: string[] = [];
  const namedExports: string[] = [];
  const typeExports: string[] = [];

  if (hasServer) {
    imports.push("import { server } from './schema/server.js';");
    envProperties.push('  server,');
    namedExports.push('server');
    typeExports.push("export type { ServerEnv } from './schema/server.js';");
  }

  if (hasDb) {
    imports.push("import { db } from './schema/db.js';");
    envProperties.push('  db,');
    namedExports.push('db');
    typeExports.push("export type { DbEnv } from './schema/db.js';");
  }

  if (hasDocker) {
    imports.push("import { docker } from './schema/docker.js';");
    envProperties.push('  docker,');
    namedExports.push('docker');
    typeExports.push("export type { DockerEnv } from './schema/docker.js';");
  }

  if (webFramework !== 'skip') {
    imports.push("import { web } from './schema/web.js';");
    envProperties.push('  web,');
    namedExports.push('web');
    typeExports.push("export type { WebEnv } from './schema/web.js';");
  }

  return [
    ...imports,
    '',
    'export const env = {',
    ...envProperties,
    '};',
    '',
    namedExports.length > 0 ? `export { ${namedExports.join(', ')} };` : '',
    ...typeExports,
    '',
  ]
    .filter(Boolean)
    .join('\n');
}
