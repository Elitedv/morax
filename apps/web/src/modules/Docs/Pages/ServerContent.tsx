'use client';

import React from 'react';
import DocsCodeBlock from '../components/DocsCodeBlock';

export const SERVER_TOC = [
  { id: 'overview', label: 'Overview' },
  { id: 'hono-server', label: 'Hono Backend' },
  { id: 'express-server', label: 'Express Backend' },
  { id: 'shared-middleware', label: 'CORS & Environment' },
  { id: 'database-access', label: 'Database Access (Drizzle)' },
  { id: 'deployment-targets', label: 'Docker & Deployment' },
];

export const ServerContent = () => {
  return (
    <div className="space-y-12">
      {/* Overview */}
      <section id="overview" className="space-y-4">
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Backend API Server (`apps/server`)
        </h2>
        <p className="text-zinc-300 text-sm leading-relaxed">
          Morax supports both <strong className="text-white">Hono</strong> and{' '}
          <strong className="text-white">Express</strong> as first-class backend
          frameworks. During monorepo initialization, the interactive wizard
          asks which backend framework you prefer, scaffolding a pre-configured,
          production-ready server in{' '}
          <code className="text-orange-400 font-mono text-xs bg-zinc-900 px-1.5 py-0.5 border border-zinc-800">
            apps/server
          </code>
          .
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 border border-zinc-800 bg-zinc-950/40">
            <span className="text-xs font-mono text-orange-400 font-semibold block mb-1">
              Hono
            </span>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Modern, ultra-fast, and built on Web Fetch API standards. Zero
              dependencies, optimal for high throughput and edge/serverless
              environments.
            </p>
          </div>
          <div className="p-4 border border-zinc-800 bg-zinc-950/40">
            <span className="text-xs font-mono text-orange-400 font-semibold block mb-1">
              Express
            </span>
            <p className="text-xs text-zinc-400 leading-relaxed">
              The classic, battle-tested standard for Node.js. Maximum
              compatibility with thousands of existing npm packages and
              traditional enterprise tooling.
            </p>
          </div>
        </div>
      </section>

      {/* Hono Backend */}
      <section
        id="hono-server"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          1. Hono Backend Architecture
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          If you choose Hono, Morax generates an entrypoint using{' '}
          <code className="text-orange-400 font-mono text-xs">
            @hono/node-server
          </code>{' '}
          with standard CORS and health check endpoints:
        </p>

        <DocsCodeBlock
          code={`// apps/server/src/index.ts (Hono)
import { env } from '@repo/env';
import { Hono } from 'hono';
import { serve, getRequestListener } from '@hono/node-server';
import { cors } from 'hono/cors';

const app = new Hono();
const port = env.server.PORT;

// Enable CORS middleware
app.use('*', cors({ origin: env.server.CORS_ORIGIN }));

// Health check endpoint
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// Example API endpoint
app.get('/api/v1/user', (c) => {
  return c.json({
    user: { id: '1', name: 'Demo User', email: 'demo@morax.dev' },
  });
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  serve({ fetch: app.fetch, port }, (info) => {
    console.log(\`🚀 Hono server running on http://localhost:\${info.port}\`);
  });
}

export { app };
export default getRequestListener(app.fetch);`}
          language="typescript"
          title="apps/server/src/index.ts (Hono)"
        />
      </section>

      {/* Express Backend */}
      <section
        id="express-server"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          2. Express Backend Architecture
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          If you choose Express, Morax scaffolds a clean TypeScript
          configuration using standard Express middleware and route handlers:
        </p>

        <DocsCodeBlock
          code={`// apps/server/src/index.ts (Express)
import express from 'express';
import cors from 'cors';
import { env } from '@repo/env';

const app = express();
const port = Number(process.env.PORT) || 4000;

// Enable CORS and body parsing
app.use(cors({ origin: env.server.CORS_ORIGIN }));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// Example API endpoint
app.get('/api/v1/user', (req, res) => {
  res.json({
    user: { id: '1', name: 'Demo User', email: 'demo@morax.dev' },
  });
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(port, () => {
    console.log(\`🚀 Express server running on http://localhost:\${port}\`);
  });
}

export default app;`}
          language="typescript"
          title="apps/server/src/index.ts (Express)"
        />
      </section>

      {/* Shared Middleware & Environment */}
      <section
        id="shared-middleware"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          CORS & Environment Integration
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Both frameworks share the centralized Zod environment package from{' '}
          <code className="text-orange-400 font-mono text-xs">@repo/env</code>.
          Ports, CORS origins, and API keys are strictly typed and verified
          before the server starts.
        </p>
      </section>

      {/* Database Access */}
      <section
        id="database-access"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Shared Database Access (Drizzle ORM)
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Whether you run Hono or Express, database queries use the exact same
          shared client from{' '}
          <code className="text-orange-400 font-mono text-xs">@repo/db</code>:
        </p>

        <DocsCodeBlock
          code={`import { db, users } from '@repo/db';

// Inside Hono:
app.get('/api/v1/users', async (c) => {
  const allUsers = await db.select().from(users);
  return c.json({ users: allUsers });
});

// Inside Express:
app.get('/api/v1/users', async (req, res) => {
  const allUsers = await db.select().from(users);
  res.json({ users: allUsers });
});`}
          language="typescript"
          title="Database Queries in Hono vs Express"
        />
      </section>

      {/* Deployment Targets */}
      <section
        id="deployment-targets"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Deployment Options
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          During CLI setup, you can choose between containerized Docker
          deployment or Vercel serverless:
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm text-zinc-400 font-mono">
          <li>
            <strong className="text-white font-sans">Docker:</strong>{' '}
            Multi-stage Dockerfile that packages your server and symlinked
            workspace dependencies into an isolated production image.
          </li>
          <li>
            <strong className="text-white font-sans">Vercel:</strong>{' '}
            Automatically exports a serverless handler (
            <code className="text-orange-400">
              export default getRequestListener(...)
            </code>{' '}
            for Hono, or standard express app handler).
          </li>
        </ul>
      </section>
    </div>
  );
};

export default ServerContent;
