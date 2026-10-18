import type { EnvSetupOptions } from './types.js';

export function getEnvPackageJson(_options?: EnvSetupOptions) {
  return {
    name: '@repo/env',
    version: '1.0.0',
    private: true,
    type: 'module',
    main: './src/index.ts',
    types: './src/index.ts',
    exports: {
      '.': {
        types: './src/index.ts',
        default: './src/index.ts',
      },
    },
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
