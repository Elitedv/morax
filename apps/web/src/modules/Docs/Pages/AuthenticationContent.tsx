'use client';

import React from 'react';
import DocsCodeBlock from '../components/DocsCodeBlock';

export const AUTH_TOC = [
  { id: 'overview', label: 'Overview' },
  { id: 'configuration', label: 'Better Auth Setup' },
  { id: 'node-handler', label: 'API Handlers' },
  { id: 'client-sessions', label: 'Client Authentication' },
  { id: 'protected-routes', label: 'Route Protection' },
];

export const AuthenticationContent = () => {
  return (
    <div className="space-y-12">
      {/* Overview */}
      <section id="overview" className="space-y-4">
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Authentication Package (`@repo/auth`)
        </h2>
        <p className="text-zinc-300 text-sm leading-relaxed">
          Morax provides complete authentication out-of-the-box using{' '}
          <strong className="text-white">Better Auth</strong>, tightly
          integrated with your shared Drizzle database and environment
          configuration.
        </p>
      </section>

      {/* Configuration */}
      <section
        id="configuration"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Better Auth Setup
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          The authentication engine is defined once in{' '}
          <code className="text-orange-400 font-mono text-xs bg-zinc-900 px-1.5 py-0.5 border border-zinc-800">
            packages/auth
          </code>
          :
        </p>

        <DocsCodeBlock
          code={`// packages/auth/src/index.ts
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@repo/db';
import { env } from '@repo/env';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: true,
  },
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
});`}
          language="typescript"
          title="packages/auth/src/index.ts"
        />
      </section>

      {/* Node Handler */}
      <section
        id="node-handler"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Mounting Auth Endpoints
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          You can mount the authentication router in Hono, Express, or Next.js
          with one line:
        </p>

        <DocsCodeBlock
          code={`// Inside your server or Next.js route handler
import { auth } from '@repo/auth';
import { toNodeHandler } from 'better-auth/node';

// All auth routes (/api/auth/*) handled automatically
app.all('/api/auth/*', toNodeHandler(auth));`}
          language="typescript"
          title="Mounting Auth Routes"
        />
      </section>

      {/* Client Sessions */}
      <section
        id="client-sessions"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Client Authentication
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          In your frontend applications, instantiate the client to sign in and
          read sessions:
        </p>

        <DocsCodeBlock
          code={`import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: 'http://localhost:3000',
});

// React Hook
export function UserProfile() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) return <div>Loading...</div>;
  if (!session) return <div>Not signed in</div>;

  return <div>Welcome, {session.user.name}!</div>;
}`}
          language="tsx"
          title="React Client Hook"
        />
      </section>

      {/* Protected Routes */}
      <section
        id="protected-routes"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Route Protection
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Verify sessions on incoming requests before executing protected
          business logic:
        </p>

        <DocsCodeBlock
          code={`const session = await auth.api.getSession({
  headers: req.headers,
});

if (!session) {
  return res.status(401).json({ error: 'Unauthorized' });
}`}
          language="typescript"
          title="Session Verification"
        />
      </section>
    </div>
  );
};

export default AuthenticationContent;
