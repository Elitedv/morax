import type { EnvSetupOptions } from './types.js';

export function getEnvPackageJson(options: EnvSetupOptions) {
  const { hasServer, hasDb, webFramework } = options;

  const exportsMap: Record<string, string> = {
    '.': './src/index.ts',
  };

  if (hasServer || hasDb) {
    exportsMap['./server'] = './src/server.ts';
  }

  if (webFramework !== 'skip') {
    exportsMap['./web'] = './src/web.ts';
  }

  return {
    name: '@repo/env',
    version: '1.0.0',
    private: true,
    type: 'module',
    exports: exportsMap,
    dependencies: {
      zod: '^3.24.2',
      dotenv: '^16.4.7',
    },
    devDependencies: {
      '@config/typescript': 'workspace:*',
      '@types/node': '^22.13.0',
      typescript: '^5.7.0',
    },
  };
}
