'use client';

import React from 'react';
import DocsCodeBlock from '../components/DocsCodeBlock';

export const TRPC_TOC = [
  { id: 'overview', label: 'Overview' },
  { id: 'monorepo-contract', label: 'Shared Router Architecture' },
  { id: 'server-adapter', label: 'Server Adapter (Hono / Express)' },
  { id: 'client-usage', label: 'Client Queries & Mutations' },
  { id: 'status', label: 'Roadmap & Availability' },
];

export const TrpcContent = () => {
  return (
    <div className="space-y-12">
      {/* Overview */}
      <section id="overview" className="space-y-4">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-orange-500/10 border border-orange-500/30 text-orange-400 font-mono text-xs font-semibold uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
          Coming Soon
        </div>

        <h2 className="text-2xl font-semibold text-white tracking-tight">
          tRPC API Layer (`packages/api`)
        </h2>
        <p className="text-zinc-300 text-sm leading-relaxed">
          Morax is adding first-class support for{' '}
          <strong className="text-white">tRPC v11</strong> as an optional
          typesafe RPC layer. Instead of manually writing API contracts or
          relying on code generators, tRPC allows Next.js and Vite clients to
          directly import server router types with full autocompletion and
          compile-time verification.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 border border-zinc-800 bg-zinc-950/40">
            <span className="text-xs font-mono text-orange-400 font-semibold block mb-1">
              End-to-End Safety
            </span>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Rename an API input or return type, and TypeScript immediately
              catches all client call sites.
            </p>
          </div>
          <div className="p-3 border border-zinc-800 bg-zinc-950/40">
            <span className="text-xs font-mono text-orange-400 font-semibold block mb-1">
              Zero Code-Gen
            </span>
            <p className="text-xs text-zinc-400 leading-relaxed">
              No schema compilation steps or build artifacts required. Pure
              TypeScript type inference.
            </p>
          </div>
          <div className="p-3 border border-zinc-800 bg-zinc-950/40">
            <span className="text-xs font-mono text-orange-400 font-semibold block mb-1">
              Multi-Runtime
            </span>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Mounts seamlessly on your existing Morax Hono or Express server in
              apps/server.
            </p>
          </div>
        </div>
      </section>

      {/* Shared Router Architecture */}
      <section
        id="monorepo-contract"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Shared Router Architecture
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          The upcoming scaffolding will place the core router in a shared
          package (
          <code className="text-orange-400 font-mono text-xs">
            packages/api
          </code>
          ), ensuring both backend and frontend applications consume the
          identical source of truth:
        </p>

        <DocsCodeBlock
          title="packages/api/src/routers/user.ts"
          code={`import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { db, users } from '@repo/db';

export const userRouter = router({
  list: publicProcedure.query(async () => {
    return await db.select().from(users);
  }),
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await db.query.users.findFirst({
        where: (u, { eq }) => eq(u.id, input.id),
      });
    }),
});`}
          language="typescript"
        />
      </section>

      {/* Server Adapter */}
      <section
        id="server-adapter"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Server Adapter (Hono / Express)
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Mounting the tRPC router onto Morax servers using the official Hono
          and Express fetch middleware:
        </p>

        <DocsCodeBlock
          title="apps/server/src/index.ts (Hono Mounting)"
          code={`import { Hono } from 'hono';
import { trpcServer } from '@hono/trpc-server';
import { appRouter, createContext } from '@repo/api';

const app = new Hono();

// Mount tRPC on /trpc/*
app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
    createContext,
  })
);

export default app;`}
          language="typescript"
        />
      </section>

      {/* Client Usage */}
      <section
        id="client-usage"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Client Queries & Mutations
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Consuming endpoints inside React frontends with TanStack Query
          integration:
        </p>

        <DocsCodeBlock
          title="apps/web/src/components/UserList.tsx"
          code={`'use client';

import { trpc } from '@/lib/trpc';

export function UserList() {
  const { data: users, isLoading } = trpc.user.list.useQuery();

  if (isLoading) return <div>Loading users...</div>;

  return (
    <ul className="space-y-2">
      {users?.map((user) => (
        <li key={user.id} className="text-sm font-mono text-zinc-300">
          {user.name} ({user.email})
        </li>
      ))}
    </ul>
  );
}`}
          language="typescript"
        />
      </section>

      {/* Status & Roadmap */}
      <section
        id="status"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Roadmap & Availability
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          tRPC integration is scheduled for the upcoming Morax CLI minor
          release. An interactive CLI prompt will let you toggle between REST
          (standard Hono/Express) and RPC (tRPC/oRPC) during scaffolding.
        </p>
      </section>
    </div>
  );
};

export default TrpcContent;
