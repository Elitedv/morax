'use client';

import React from 'react';
import DocsCodeBlock from '../components/DocsCodeBlock';

export const ORPC_TOC = [
  { id: 'overview', label: 'Overview' },
  { id: 'contract-first', label: 'Contract-First Definitions' },
  { id: 'openapi-generation', label: 'OpenAPI 3.1 & Swagger UI' },
  { id: 'hono-mounting', label: 'Mounting on Hono / Web Standards' },
  { id: 'status', label: 'Roadmap & Availability' },
];

export const OrpcContent = () => {
  return (
    <div className="space-y-12">
      {/* Overview */}
      <section id="overview" className="space-y-4">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-orange-500/10 border border-orange-500/30 text-orange-400 font-mono text-xs font-semibold uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
          Coming Soon
        </div>

        <h2 className="text-2xl font-semibold text-white tracking-tight">
          oRPC API Layer (`packages/api`)
        </h2>
        <p className="text-zinc-300 text-sm leading-relaxed">
          <strong className="text-white">oRPC</strong> is the next-generation
          RPC framework that bridges the gap between end-to-end TypeScript
          typesafety and public OpenAPI/REST standards. While traditional RPC
          solutions lock you into closed client libraries, oRPC automatically
          produces valid <strong className="text-white">OpenAPI 3.1</strong>{' '}
          specifications and Swagger docs from your native TypeScript schema
          definitions.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 border border-zinc-800 bg-zinc-950/40">
            <span className="text-xs font-mono text-orange-400 font-semibold block mb-1">
              OpenAPI Native
            </span>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every procedure is simultaneously an RPC endpoint and a documented
              REST route with Swagger UI.
            </p>
          </div>
          <div className="p-3 border border-zinc-800 bg-zinc-950/40">
            <span className="text-xs font-mono text-orange-400 font-semibold block mb-1">
              Web Standards
            </span>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Built on Web Request/Response specs, making it natively compatible
              with Hono and Cloudflare.
            </p>
          </div>
          <div className="p-3 border border-zinc-800 bg-zinc-950/40">
            <span className="text-xs font-mono text-orange-400 font-semibold block mb-1">
              Contract First
            </span>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Define reusable API contracts with Zod or Valibot, allowing mock
              servers and independent testing.
            </p>
          </div>
        </div>
      </section>

      {/* Contract-First Definitions */}
      <section
        id="contract-first"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Contract-First Definitions
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Contracts are declared in{' '}
          <code className="text-orange-400 font-mono text-xs">
            packages/api
          </code>{' '}
          without needing runtime server dependencies:
        </p>

        <DocsCodeBlock
          title="packages/api/src/contracts/users.ts"
          code={`import { oc } from '@orpc/contract';
import { z } from 'zod';

export const listUsersContract = oc
  .input(z.object({ limit: z.number().default(20) }))
  .output(z.array(z.object({ id: z.string(), name: z.string(), email: z.string() })))
  .route({
    method: 'GET',
    path: '/users',
    summary: 'List workspace users',
  });`}
          language="typescript"
        />
      </section>

      {/* OpenAPI Generation */}
      <section
        id="openapi-generation"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          OpenAPI 3.1 & Swagger UI
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Generate production-ready OpenAPI schemas effortlessly for external
          API consumers and frontend SDK generators:
        </p>

        <DocsCodeBlock
          title="apps/server/src/openapi.ts"
          code={`import { generateOpenAPISpec } from '@orpc/openapi';
import { router } from './router';

export const spec = generateOpenAPISpec(router, {
  info: {
    title: 'Morax API Service',
    version: '1.0.0',
    description: 'Auto-generated OpenAPI spec powered by oRPC',
  },
});`}
          language="typescript"
        />
      </section>

      {/* Hono Mounting */}
      <section
        id="hono-mounting"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Mounting on Hono / Web Standards
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          oRPC mounts directly onto Hono instances using standard HTTP handlers:
        </p>

        <DocsCodeBlock
          title="apps/server/src/index.ts (oRPC Handler)"
          code={`import { Hono } from 'hono';
import { createORPCHandler } from '@orpc/server/fetch';
import { router } from './router';

const app = new Hono();

const handler = createORPCHandler({ router });

// Handle both RPC client calls and standard REST requests
app.all('/api/*', async (c) => {
  const response = await handler(c.req.raw);
  return response ?? c.notFound();
});

export default app;`}
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
          oRPC support is planned alongside tRPC in Morax v0.2.0. Users will be
          able to choose between standard REST, tRPC, and oRPC directly from the
          interactive initialization CLI.
        </p>
      </section>
    </div>
  );
};

export default OrpcContent;
