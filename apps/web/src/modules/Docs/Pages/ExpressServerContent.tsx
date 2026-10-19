'use client';

import React from 'react';
import DocsCodeBlock from '../components/DocsCodeBlock';

export const EXPRESS_SERVER_TOC = [
  { id: 'overview', label: 'Overview' },
  { id: 'structure', label: 'Project Structure' },
  { id: 'server-code', label: 'Server Setup' },
  { id: 'database', label: 'Database Access (@repo/db)' },
  { id: 'middleware', label: 'Middleware & Routes' },
  { id: 'scripts', label: 'Development & Build' },
  { id: 'deployment', label: 'Docker & Deployment' },
];

export const ExpressServerContent = () => {
  return (
    <div className="space-y-12">
      {/* Overview */}
      <section id="overview" className="space-y-4">
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Express API Server (`apps/server`)
        </h2>
        <p className="text-zinc-300 text-sm leading-relaxed">
          When you choose <strong className="text-white">Express</strong> during
          project initialization, Morax configures the industry-standard Node.js
          framework inside{' '}
          <code className="text-orange-400 font-mono text-xs bg-zinc-900 px-1.5 py-0.5 border border-zinc-800">
            apps/server
          </code>
          . Express offers unmatched ecosystem compatibility, thousands of
          battle-tested npm middlewares, and familiar request/response
          conventions for production REST APIs.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 border border-zinc-800 bg-zinc-950/40">
            <span className="text-xs font-mono text-orange-400 font-semibold block mb-1">
              Battle-Tested
            </span>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Decades of enterprise stability and reliable production history.
            </p>
          </div>
          <div className="p-3 border border-zinc-800 bg-zinc-950/40">
            <span className="text-xs font-mono text-orange-400 font-semibold block mb-1">
              Vast Ecosystem
            </span>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Plug and play with any npm middleware (Passport, Multer, Helmet,
              Winston).
            </p>
          </div>
          <div className="p-3 border border-zinc-800 bg-zinc-950/40">
            <span className="text-xs font-mono text-orange-400 font-semibold block mb-1">
              Monorepo Integration
            </span>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Pre-wired with @repo/db (Drizzle) and @repo/env with TypeScript
              type checks.
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
          The Express server structure is structured for straightforward
          scalability:
        </p>

        <DocsCodeBlock
          filename="apps/server structure"
          code={`apps/server/
├── src/
│   └── index.ts          # Express application, routes, error handlers
├── package.json          # Dependencies: express, cors, @repo/db, @repo/env
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
          The generated Express configuration handles JSON parsing, CORS
          headers, health checks, and database routes:
        </p>

        <DocsCodeBlock
          filename="apps/server/src/index.ts (Express)"
          code={`import express from 'express';
import cors from 'cors';
import { db, users } from '@repo/db';

const app = express();

if (!process.env.PORT) {
  throw new Error('PORT environment variable is required');
}
const port = Number(process.env.PORT);

// Middlewares: CORS and JSON body parser
app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Morax Express API (Node.js)!',
    status: 'healthy',
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// Database endpoint querying shared package
app.get('/api/v1/user', async (req, res) => {
  try {
    const allUsers = await db.select().from(users);
    res.json({ users: allUsers });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Start local listener in development
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(port, () => {
    console.log(\`🚀 Express server running on http://localhost:\${port}\`);
  });
}

// Export for serverless environments (e.g. Vercel)
export default app;`}
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
          Query your Postgres database directly with Drizzle ORM imported from{' '}
          <strong className="text-white">@repo/db</strong>:
        </p>

        <DocsCodeBlock
          filename="Example Express Route Handler"
          code={`import { db, users } from '@repo/db';
import { eq } from 'drizzle-orm';

// Get user by ID
app.get('/api/v1/user/:id', async (req, res) => {
  try {
    const user = await db.select().from(users).where(eq(users.id, req.params.id)).limit(1);
    if (!user.length) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: user[0] });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create user
app.post('/api/v1/user', async (req, res) => {
  try {
    const [created] = await db.insert(users).values(req.body).returning();
    res.status(201).json({ user: created });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});`}
          language="typescript"
        />
      </section>

      {/* Middleware & Routes */}
      <section
        id="middleware"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Middleware & Routes
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Organize complex endpoints by separating domain logic into modular
          Express routers:
        </p>

        <DocsCodeBlock
          filename="apps/server/src/routes/users.ts"
          code={`import { Router } from 'express';
import { db, users } from '@repo/db';

export const userRouter = Router();

userRouter.get('/', async (req, res) => {
  const result = await db.select().from(users);
  res.json({ users: result });
});

// In src/index.ts:
// app.use('/api/v1/users', userRouter);`}
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
          Manage your Express backend via Turbo monorepo commands:
        </p>

        <DocsCodeBlock
          filename="Terminal"
          code={`# Run only the Express server with live reload
pnpm --filter server dev

# Check TypeScript types
pnpm --filter server check-types

# Compile production bundle
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
          Deploy Express on any cloud VM, Kubernetes, AWS ECS, or Render using
          the included Dockerfile:
        </p>

        <DocsCodeBlock
          filename="Dockerfile (Production Runner)"
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

export default ExpressServerContent;
