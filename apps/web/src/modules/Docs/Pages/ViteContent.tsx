'use client';

import React from 'react';
import DocsCodeBlock from '../components/DocsCodeBlock';

export const VITE_TOC = [
  { id: 'overview', label: 'Overview' },
  { id: 'spa-setup', label: 'SPA Architecture' },
  { id: 'sharing-ui', label: 'Shared Component Styling' },
  { id: 'configuration', label: 'Vite & TypeScript Config' },
];

export const ViteContent = () => {
  return (
    <div className="space-y-12">
      {/* Overview */}
      <section id="overview" className="space-y-4">
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          React + Vite in Morax
        </h2>
        <p className="text-zinc-300 text-sm leading-relaxed">
          The Vite workspace (located at{' '}
          <code className="text-orange-400 font-mono text-xs bg-zinc-900 px-1.5 py-0.5 border border-zinc-800">
            apps/desktop
          </code>{' '}
          or custom client apps) provides an instant-boot, single-page
          application template powered by Rollup, ESBuild, and React 19.
        </p>
      </section>

      {/* SPA Setup */}
      <section
        id="spa-setup"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          SPA Architecture
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Vite apps are ideal for client-heavy portals, admin dashboards, or
          Electron/Tauri desktop wrappers that don't require full server-side
          rendering:
        </p>

        <DocsCodeBlock
          code={`apps/desktop/
├── src/
│   ├── main.tsx            # Application entrypoint
│   ├── App.tsx             # Root dashboard layout
│   └── index.css           # Tailwind CSS imports
├── index.html              # HTML shell
├── vite.config.ts          # Vite configuration with workspace resolver
└── package.json            # Desktop package dependencies`}
          language="text"
          title="apps/desktop Layout"
        />
      </section>

      {/* Shared Component Styling */}
      <section
        id="sharing-ui"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Shared Component Styling
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Both Next.js and Vite applications consume the exact same UI
          components from{' '}
          <code className="text-orange-400 font-mono text-xs">
            @workspace/ui
          </code>
          . When you modify a button or card, changes reflect across both
          applications instantly:
        </p>

        <DocsCodeBlock
          code={`// apps/desktop/src/App.tsx
import { useState } from 'react';
import { Button } from '@workspace/ui/components/button';

export function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold tracking-tight mb-4">Desktop App</h1>
      <Button onClick={() => setCount((c) => c + 1)}>
        Count is: {count}
      </Button>
    </div>
  );
}`}
          language="tsx"
          title="apps/desktop/src/App.tsx"
        />
      </section>

      {/* Vite Configuration */}
      <section
        id="configuration"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Vite & TypeScript Configuration
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Morax automatically configures Vite’s module resolution so symlinked
          monorepo packages are watched during development:
        </p>

        <DocsCodeBlock
          code={`// apps/desktop/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});`}
          language="typescript"
          title="apps/desktop/vite.config.ts"
        />
      </section>
    </div>
  );
};

export default ViteContent;
