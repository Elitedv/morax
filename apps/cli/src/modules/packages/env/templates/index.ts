import type { EnvSetupOptions } from '../types.js';

export function renderIndexEnvTemplate(options: EnvSetupOptions): string {
  const exports: string[] = [];
  const { hasServer, hasDb, webFramework } = options;

  if ((hasServer || hasDb) && webFramework !== 'skip') {
    // Both server and web: re-export with distinct names to prevent TS duplicate symbol collision on 'env'
    exports.push(
      "export { env as serverEnv, type ServerEnv, serverSchema } from './server.js';",
    );
    exports.push(
      "export { env as clientEnv, type WebEnv, webSchema } from './web.js';",
    );
  } else if (hasServer || hasDb) {
    exports.push("export * from './server.js';");
  } else if (webFramework !== 'skip') {
    exports.push("export * from './web.js';");
  }

  return [...exports, ''].join('\n');
}
