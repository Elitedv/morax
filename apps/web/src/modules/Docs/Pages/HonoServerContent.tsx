'use client';

import React from 'react';
import DocsCodeBlock from '../components/DocsCodeBlock';

export const HONO_SERVER_TOC = [
  { id: 'overview', label: 'Overview' },
  { id: 'structure', label: 'Project Structure' },
  { id: 'server-code', label: 'Server Setup' },
  { id: 'database', label: 'Database Access (@repo/db)' },
  { id: 'env-cors', label: 'CORS & Environment' },
  { id: 'scripts', label: 'Development & Build' },
  { id: 'deployment', label: 'Docker & Deployment' },
];

export const HonoServerContent = () => {
  return (
    <div className="space-y-12">
      {/* Overview */}
      <section id="overview" className="space-y-4">
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Hono API Server (`apps/server`)
        </h2>
        <p className="text-zinc-300 text-sm leading-relaxed">
          When you select <strong className="text-white">Hono</strong> during
          Morax project creation, an ultra-fast, lightweight Web-standards API
          server is scaffolded in{' '}
          <code className="text-orange-400 font-mono text-xs bg-zinc-900 px-1.5 py-0.5 border border-zinc-800">
            apps/server
          </code>
          . Hono uses the Web Fetch API specification, providing unmatched
          execution speed, minimal runtime overhead, and seamless compatibility
          across Node.js, Bun, Docker, and serverless edge functions.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 border border-zinc-800 bg-zinc-950/40">
            <span className="text-xs font-mono text-orange-400 font-semibold block mb-1">
              Web Standards
            </span>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Native Request/Response interfaces without heavy legacy Node.js
              wrappers.
            </p>
          </div>
          <div className="p-3 border border-zinc-800 bg-zinc-950/40">
            <span className="text-xs font-mono text-orange-400 font-semibold block mb-1">
              Zero Dependencies
            </span>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Ultra-compact footprint with instantaneous cold starts and rapid
              boot times.
            </p>
          </div>
          <div className="p-3 border border-zinc-800 bg-zinc-950/40">
            <span className="text-xs font-mono text-orange-400 font-semibold block mb-1">
              Universal Runtime
            </span>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Runs identically on Node.js via @hono/node-server, Vercel,
              Cloudflare, or Docker.
            </p>
          </div>
        </div>
      </section>

      {/* Structure */}
      <section
        id="structure"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Project Structure
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          The Hono server application includes workspace links to shared
          packages such as database models and environment validation:
        </p>

        <DocsCodeBlock
          filename="apps/server structure"
          code={`apps/server/
├── src/
│   └── index.ts          # Hono app instance, middlewares, and route handlers
├── package.json          # Dependencies: hono, @hono/node-server, @repo/db, @repo/env
├── tsconfig.json         # Extends @repo/typescript-config
└── Dockerfile            # Multi-stage production container build`}
          language="bash"
        />
      </section>

      {/* Server Implementation */}
      <section
        id="server-code"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Server Setup (`src/index.ts`)
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Morax configures Hono using{' '}
          <code className="text-orange-400 font-mono text-xs">
            @hono/node-server
          </code>{' '}
          for local execution and serverless exports for zero-friction cloud
          deployment:
        </p>

        <DocsCodeBlock
          filename="apps/server/src/index.ts (Hono)"
          code={`import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { getRequestListener } from '@hono/node-server';
import { cors } from 'hono/cors';
import { db, users } from '@repo/db';

const app = new Hono();

if (!process.env.PORT) {
  throw new Error('PORT environment variable is required');
}
const port = Number(process.env.PORT);

// Enable CORS middleware
app.use('*', cors());

// Root route
app.get('/', (c) => {
  return c.json({
    message: 'Welcome to the Morax Hono API (Node.js)!',
    status: 'healthy',
  });
});

// Health check route
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// Database endpoint querying shared package
app.get('/api/v1/user', async (c) => {
  try {
    const allUsers = await db.select().from(users);
    return c.json({ users: allUsers });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Start local Node.js server in development
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  serve(
    {
      fetch: app.fetch,
      port,
    },
    (info) => {
      console.log(\`🚀 Hono server running on http://localhost:\${info.port}\`);
    }
  );
}

// Export for serverless environments (e.g. Vercel)
export default getRequestListener(app.fetch);`}
          language="typescript"
        />
      </section>

      {/* Database Queries */}
      <section
        id="database"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Database Access (`@repo/db`)
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Hono connects seamlessly with the shared{' '}
          <strong className="text-white">@repo/db</strong> package. Drizzle ORM
          provides type-safe queries and automatic JSON serialization:
        </p>

        <DocsCodeBlock
          filename="Example Hono CRUD Handler"
          code={`import { db, users } from '@repo/db';
import { eq } from 'drizzle-orm';

// Fetch user by ID
app.get('/api/v1/user/:id', async (c) => {
  const id = c.req.param('id');
  const user = await db.select().from(users).where(eq(users.id, id)).limit(1);

  if (!user.length) {
    return c.json({ error: 'User not found' }, 404);
  }
  return c.json({ user: user[0] });
});

// Create user
app.post('/api/v1/user', async (c) => {
  const body = await c.req.json();
  const [created] = await db.insert(users).values(body).returning();
  return c.json({ user: created }, 201);
});`}
          language="typescript"
        />
      </section>

      {/* CORS & Environment */}
      <section
        id="env-cors"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          CORS & Environment Variables
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Hono provides built-in CORS middleware with granular origin
          restrictions. Combined with{' '}
          <strong className="text-white">@repo/env</strong>, all runtime
          environment variables are validated at startup:
        </p>

        <DocsCodeBlock
          filename="apps/server/src/index.ts (CORS Config)"
          code={`import { cors } from 'hono/cors';

app.use(
  '*',
  cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);`}
          language="typescript"
        />
      </section>

      {/* Scripts */}
      <section
        id="scripts"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Development & Build
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Run your Hono server either individually or in parallel with frontends
          using Turbo workspace filtering:
        </p>

        <DocsCodeBlock
          filename="Terminal"
          code={`# Run only the Hono server in watch mode
pnpm --filter server dev

# Type check the server
pnpm --filter server check-types

# Build production bundle with tsup / esbuild
pnpm --filter server build`}
          language="bash"
        />
      </section>

      {/* Deployment */}
      <section
        id="deployment"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Docker & Deployment
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Morax includes an optimized multi-stage Dockerfile tailored for
          containerized deployments:
        </p>

        <DocsCodeBlock
          filename="Dockerfile (Multi-Stage Build)"
          code={`FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm turbo run build --filter=server...

FROM base AS runner
WORKDIR /app
COPY --from=builder /app/apps/server/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000

CMD ["node", "dist/index.js"]`}
          language="dockerfile"
        />
      </section>
    </div>
  );
};

export default HonoServerContent;
