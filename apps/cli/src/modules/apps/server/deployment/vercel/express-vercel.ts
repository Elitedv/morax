import fsPromises from 'fs/promises';
import path from 'path';
import type { ServerRuntime } from '../../types.js';

export async function setupExpressVercel(
  serverDir: string,
  _runtime: ServerRuntime,
) {
  const vercelConfig = {
    version: 2,
    builds: [
      {
        src: 'src/index.ts',
        use: '@vercel/node',
      },
    ],
    routes: [
      {
        src: '/(.*)',
        dest: 'src/index.ts',
      },
    ],
  };

  await fsPromises.writeFile(
    path.join(serverDir, 'vercel.json'),
    JSON.stringify(vercelConfig, null, 2),
    'utf8',
  );
}
