'use client';

import React from 'react';
import DocsCodeBlock from '../components/DocsCodeBlock';

export const DEPLOYMENT_TOC = [
  { id: 'overview', label: 'Overview' },
  { id: 'docker-setup', label: 'Multi-Stage Dockerfiles' },
  { id: 'docker-compose', label: 'Docker Compose' },
  { id: 'vercel-deploy', label: 'Deploying to Vercel' },
  { id: 'production-tips', label: 'Production Best Practices' },
];

export const DeploymentContent = () => {
  return (
    <div className="space-y-12">
      {/* Overview */}
      <section id="overview" className="space-y-4">
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Docker & Production Deployment
        </h2>
        <p className="text-zinc-300 text-sm leading-relaxed">
          Morax monorepos can be deployed seamlessly as standalone Docker
          containers (for Hono, Express, or self-hosted Next.js) or as
          edge/serverless functions on Vercel and Railway.
        </p>
      </section>

      {/* Multi-Stage Dockerfiles */}
      <section
        id="docker-setup"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Multi-Stage Dockerfile
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Morax provides optimized, multi-stage Dockerfiles that leverage PNPM
          pruned workspace isolation to generate ultra-small runtime images:
        </p>

        <DocsCodeBlock
          code={`FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

# Prune workspace for target app
FROM base AS pruner
WORKDIR /app
COPY . .
RUN pnpm --filter server --prod deploy /app/deploy

# Final runtime image
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=pruner /app/deploy ./
EXPOSE 4000
CMD ["node", "dist/index.js"]`}
          language="text"
          title="Dockerfile (Server)"
        />
      </section>

      {/* Docker Compose */}
      <section
        id="docker-compose"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Local Multi-Service Docker Compose
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Spin up PostgreSQL, Redis, and your API backend with a single command:
        </p>

        <DocsCodeBlock
          code={`version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: morax_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:`}
          language="yaml"
          title="docker-compose.yml"
        />
      </section>

      {/* Vercel Deployment */}
      <section
        id="vercel-deploy"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Deploying Next.js to Vercel
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          When deploying to Vercel, set the <strong>Root Directory</strong> to
          the project root and specify the build command:
        </p>

        <DocsCodeBlock
          code={`# Root Directory: ./
# Build Command:
pnpm --filter web build

# Output Directory:
apps/web/.next`}
          language="bash"
          title="Vercel Monorepo Settings"
        />
      </section>

      {/* Production Best Practices */}
      <section
        id="production-tips"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Production Best Practices
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Before deploying to production:
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm text-zinc-400 font-mono">
          <li>
            Run <code className="text-orange-400">pnpm build</code> locally to
            ensure TypeScript passes in all workspaces.
          </li>
          <li>
            Set <code className="text-orange-400">NODE_ENV=production</code> so
            Zod validates required environment variables.
          </li>
          <li>
            Run database migrations via CI/CD before initiating container
            rollouts.
          </li>
        </ul>
      </section>
    </div>
  );
};

export default DeploymentContent;
