import type { EnvSetupOptions } from '../types.js';

export function renderIndexEnvTemplate(options: EnvSetupOptions): string {
  const { hasServer, hasDb, webFramework, hasDocker } = options;
  const exports: string[] = [];

  if (hasServer) {
    exports.push(
      "export { env as serverEnv, type ServerEnv, serverSchema } from './server.js';",
    );
  }

  if (hasDb) {
    exports.push(
      "export { env as dbEnv, type DbEnv, dbSchema } from './db.js';",
    );
  }

  if (hasDocker) {
    exports.push(
      "export { env as dockerEnv, type DockerEnv, dockerSchema } from './docker.js';",
    );
  }

  if (webFramework !== 'skip') {
    exports.push(
      "export { env as clientEnv, type WebEnv, webSchema } from './web.js';",
    );
  }

  return [...exports, ''].join('\n');
}
