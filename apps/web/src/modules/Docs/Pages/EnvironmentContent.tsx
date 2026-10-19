'use client';

import React from 'react';
import DocsCodeBlock from '../components/DocsCodeBlock';

export const ENV_TOC = [
  { id: 'overview', label: 'Overview' },
  { id: 'zod-schema', label: 'Zod Validation Schema' },
  { id: 'client-vs-server', label: 'Server vs. Client Safety' },
  { id: 'usage', label: 'Usage Across Apps' },
];

export const EnvironmentContent = () => {
  return (
    <div className="space-y-12">
      {/* Overview */}
      <section id="overview" className="space-y-4">
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Environment Package (`@repo/env`)
        </h2>
        <p className="text-zinc-300 text-sm leading-relaxed">
          Runtime environment mistakes are one of the most common causes of
          production outages. Morax uses a dedicated{' '}
          <code className="text-orange-400 font-mono text-xs bg-zinc-900 px-1.5 py-0.5 border border-zinc-800">
            packages/env
          </code>{' '}
          powered by <strong className="text-white">Zod</strong> to parse,
          validate, and autocomplete all environment variables across every app
          in your workspace.
        </p>
      </section>

      {/* Schema */}
      <section
        id="zod-schema"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Zod Validation Schema
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Variables are validated on server startup. If a variable is missing or
          malformed, the process fails fast with a clear error:
        </p>

        <DocsCodeBlock
          code={`// packages/env/src/index.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().url(),
  BETTER_AUTH_SECRET: z.string().min(16),
  BETTER_AUTH_URL: z.string().url().default('http://localhost:3000'),
  server: z.object({
    PORT: z.coerce.number().default(4000),
    CORS_ORIGIN: z.string().default('http://localhost:3000'),
  }),
});

export const env = envSchema.parse(process.env);`}
          language="typescript"
          title="packages/env/src/index.ts"
        />
      </section>

      {/* Server vs Client Safety */}
      <section
        id="client-vs-server"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Server vs. Client Safety
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Secret keys (such as database credentials and auth secrets) are
          restricted to server-side bundles and prevented from accidentally
          leaking into public client bundles.
        </p>
      </section>

      {/* Usage */}
      <section
        id="usage"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Usage Across Workspace Apps
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Import <code className="text-orange-400 font-mono text-xs">env</code>{' '}
          anywhere with instant type safety and editor autocomplete:
        </p>

        <DocsCodeBlock
          code={`import { env } from '@repo/env';

console.log(env.server.PORT); // Typed as number
console.log(env.DATABASE_URL); // Typed as string`}
          language="typescript"
          title="Consuming Env"
        />
      </section>
    </div>
  );
};

export default EnvironmentContent;
