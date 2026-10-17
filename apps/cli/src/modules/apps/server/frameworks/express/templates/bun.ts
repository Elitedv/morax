export function renderExpressBunTemplate(hasDb: boolean): string {
  const dbImport = hasDb ? ["import { db, users } from '@repo/db';"] : [];
  const dbRoute = hasDb
    ? [
        '// Example endpoint querying shared database package (Drizzle ORM)',
        "app.get('/api/users', async (req, res) => {",
        '  try {',
        '    const allUsers = await db.select().from(users);',
        '    res.json({ users: allUsers });',
        '  } catch (error: any) {',
        '    res.status(500).json({ error: error.message });',
        '  }',
        '});',
        '',
      ]
    : [];

  return [
    "import express from 'express';",
    "import cors from 'cors';",
    "import { env } from '@repo/env/server';",
    ...dbImport,
    '',
    'const app = express();',
    'const port = env.PORT;',
    '',
    '// Enable CORS and parsing of JSON request bodies',
    'app.use(cors({ origin: env.CORS_ORIGIN }));',
    'app.use(express.json());',
    '',
    '// Root API health and welcome route',
    "app.get('/api', (req, res) => {",
    '  res.json({',
    "    message: 'Welcome to the Morax High-Performance Express API (Bun)!',",
    '    timestamp: new Date().toISOString(),',
    "    status: 'healthy',",
    '  });',
    '});',
    '',
    ...dbRoute,
    "if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {",
    '  app.listen(port, () => {',
    '    console.log(`🚀 Express server running on http://localhost:${port}`);',
    '  });',
    '}',
    '',
    'export default app;',
    '',
  ].join('\n');
}
