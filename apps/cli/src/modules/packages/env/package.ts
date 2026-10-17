import type { EnvSetupOptions } from './types.js';

export function getEnvPackageJson(options: EnvSetupOptions) {
  const { hasServer, hasDb, hasDocker, webFramework } = options;

  const exportsMap: Record<string, string> = {
    '.': './src/index.ts',
  };

  if (hasServer || hasDb) {
    exportsMap['./server'] = './src/schema/server.ts';
  }

  if (hasDb) {
    exportsMap['./db'] = './src/schema/db.ts';
  }

  if (hasDocker) {
    exportsMap['./docker'] = './src/schema/docker.ts';
  }

  if (webFramework !== 'skip') {
    exportsMap['./web'] = './src/schema/web.ts';
  }

  return {
    name: '@repo/env',
    version: '1.0.0',
    private: true,
    type: 'module',
    exports: exportsMap,
    scripts: {
      check: 'tsx src/check.ts',
    },
    dependencies: {
      zod: '^3.24.2',
      dotenv: '^16.4.7',
    },
    devDependencies: {
      '@config/typescript': 'workspace:*',
      '@types/node': '^22.13.0',
      tsx: '^4.19.3',
      typescript: '^5.7.0',
    },
  };
}
