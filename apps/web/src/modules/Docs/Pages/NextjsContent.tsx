'use client';

import React from 'react';
import DocsCodeBlock from '../components/DocsCodeBlock';

export const NEXTJS_TOC = [
  { id: 'overview', label: 'Overview' },
  { id: 'directory-layout', label: 'Directory Layout' },
  { id: 'consuming-packages', label: 'Consuming Packages' },
  { id: 'server-and-client', label: 'Server & Client Boundaries' },
  { id: 'api-routes', label: 'Route Handlers' },
];

export const NextjsContent = () => {
  return (
    <div className="space-y-12">
      {/* Overview */}
      <section id="overview" className="space-y-4">
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Next.js in Morax
        </h2>
        <p className="text-zinc-300 text-sm leading-relaxed">
          Morax scaffolds Next.js 15+ with the App Router inside the{' '}
          <code className="text-orange-400 font-mono text-xs bg-zinc-900 px-1.5 py-0.5 border border-zinc-800">
            apps/web
          </code>{' '}
          workspace. It comes pre-configured with React 19, Tailwind CSS v4,
          Lucide icons, and zero-build symlinks to your shared monorepo
          packages.
        </p>
      </section>

      {/* Directory Layout */}
      <section
        id="directory-layout"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Application Layout
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          The Next.js app adopts a modular feature structure where business
          logic is separated from routes:
        </p>

        <DocsCodeBlock
          code={`apps/web/
├── src/
│   ├── app/                # Next.js App Router (pages & route handlers)
│   │   ├── layout.tsx      # Root layout with fonts & providers
│   │   ├── page.tsx        # Homepage route
│   │   └── api/            # Serverless route handlers
│   ├── modules/            # Feature-driven modular components
│   │   └── Home/           # Homepage-specific components & sections
│   ├── Shared/             # Cross-cutting UI components (Navbar, Footer, Providers)
│   └── lib/                # Utility helpers (cn, tailwind merge)
├── public/                 # Static assets & icons
└── package.json            # Application dependencies & scripts`}
          language="text"
          title="apps/web Layout"
        />
      </section>

      {/* Consuming Shared Packages */}
      <section
        id="consuming-packages"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Consuming Shared Packages
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Because Morax links workspace packages through pnpm symlinks, you can
          import components from{' '}
          <code className="text-orange-400 font-mono text-xs">
            @workspace/ui
          </code>{' '}
          or shared packages directly with full TypeScript autocomplete:
        </p>

        <DocsCodeBlock
          code={`// apps/web/src/app/page.tsx
import { Button } from '@workspace/ui/components/button';
import { Card, CardHeader, CardTitle, CardContent } from '@workspace/ui/components/card';

export default function Page() {
  return (
    <main className="min-h-screen p-8 bg-black text-white">
      <Card className="max-w-md bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle>Morax Monorepo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-zinc-400">
            Rendered natively via React Server Components with shared UI tokens.
          </p>
          <Button variant="default" className="w-full">
            Get Started
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}`}
          language="tsx"
          title="apps/web/src/app/page.tsx"
        />
      </section>

      {/* Server & Client Boundaries */}
      <section
        id="server-and-client"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Server & Client Boundaries
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          All shared packages in Morax are compiled as ES modules. Server
          Components run purely on the server, while interactive client
          components require the{' '}
          <code className="text-orange-400 font-mono text-xs">
            'use client'
          </code>{' '}
          directive at the component boundary.
        </p>
      </section>

      {/* Route Handlers */}
      <section
        id="api-routes"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Route Handlers & Server Actions
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          For lightweight API routes that need direct database access, you can
          import your shared database schema and query helpers inside Next.js
          Route Handlers:
        </p>

        <DocsCodeBlock
          code={`// apps/web/src/app/api/health/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'web',
    timestamp: new Date().toISOString(),
  });
}`}
          language="typescript"
          title="apps/web/src/app/api/health/route.ts"
        />
      </section>
    </div>
  );
};

export default NextjsContent;
