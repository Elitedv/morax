export function renderHonoBunTemplate(hasDb: boolean): string {
  const dbImport = hasDb ? ["import { db, users } from '@repo/db';"] : [];
  const dbRoute = hasDb
    ? [
        '// Example endpoint querying shared database package (Drizzle ORM)',
        "app.get('/api/users', async (c) => {",
        '  try {',
        '    const allUsers = await db.select().from(users);',
        '    return c.json({ users: allUsers });',
        '  } catch (error: any) {',
        '    return c.json({ error: error.message }, 500);',
        '  }',
        '});',
        '',
      ]
    : [];

  return [
    "import { Hono } from 'hono';",
    "import { cors } from 'hono/cors';",
    "import { env } from '@repo/env/server';",
    ...dbImport,
    '',
    'const app = new Hono();',
    'const port = env.PORT;',
    '',
    '// Enable CORS middleware',
    "app.use('*', cors({ origin: env.CORS_ORIGIN }));",
    '',
    '// Root API health and welcome route',
    "app.get('/api', (c) => {",
    '  return c.json({',
    "    message: 'Welcome to the Morax High-Performance Hono API (Bun)!',",
    '    timestamp: new Date().toISOString(),',
    "    status: 'healthy',",
    '  });',
    '});',
    '',
    ...dbRoute,
    'console.log(`🚀 Hono server (Bun) running on http://localhost:${port}`);',
    '',
    'export { app };',
    'export default {',
    '  port,',
    '  fetch: app.fetch,',
    '};',
    '',
  ].join('\n');
}
