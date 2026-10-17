import fsPromises from 'fs/promises';
import path from 'path';
import { runCommand } from '../../../../../utils/exec.js';
import type { ServerRuntime } from '../../types.js';

export async function setupHonoVercel(
  serverDir: string,
  runtime: ServerRuntime,
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

  // If Hono was initialized with Bun, ensure @hono/node-server adapter is available for Vercel's Node environment
  if (runtime === 'bun') {
    await runCommand('pnpm add @hono/node-server', {
      cwd: serverDir,
      silent: true,
    });

    const indexTsPath = path.join(serverDir, 'src', 'index.ts');
    try {
      let content = await fsPromises.readFile(indexTsPath, 'utf8');
      if (!content.includes('@hono/node-server')) {
        content =
          "import { getRequestListener } from '@hono/node-server';\n" + content;
      }
      if (content.includes('export default {')) {
        content = content.replace(
          /export default\s*\{[\s\S]*?\};/,
          'export default process.env.VERCEL\n  ? getRequestListener(app.fetch)\n  : {\n      port,\n      fetch: app.fetch,\n    };',
        );
      }
      await fsPromises.writeFile(indexTsPath, content, 'utf8');
    } catch {
      // Ignore if file structure differs
    }
  }
}
