'use client';

import React from 'react';
import DocsCodeBlock from '../components/DocsCodeBlock';

export const WORKSPACE_TOC = [
  { id: 'overview', label: 'Overview' },
  { id: 'workspace-yaml', label: 'pnpm-workspace.yaml' },
  { id: 'filtering', label: 'Filtering Commands (--filter)' },
  { id: 'adding-dependencies', label: 'Adding Dependencies' },
  { id: 'parallel-scripts', label: 'Parallel Script Execution' },
];

export const WorkspaceContent = () => {
  return (
    <div className="space-y-12">
      {/* Overview */}
      <section id="overview" className="space-y-4">
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Workspace Management & Filtering
        </h2>
        <p className="text-zinc-300 text-sm leading-relaxed">
          Morax leverages PNPM workspaces to provide lightning-fast,
          disk-efficient package management with isolated node_modules and
          hardlink deduplication.
        </p>
      </section>

      {/* Workspace YAML */}
      <section
        id="workspace-yaml"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          pnpm-workspace.yaml
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          The root workspace configuration maps all directories that contain
          apps and packages:
        </p>

        <DocsCodeBlock
          code={`packages:
  - "apps/*"
  - "packages/*"`}
          language="yaml"
          title="pnpm-workspace.yaml"
        />
      </section>

      {/* Filtering */}
      <section
        id="filtering"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Filtering Commands (`--filter`)
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          The{' '}
          <code className="text-orange-400 font-mono text-xs">--filter</code>{' '}
          (or <code className="text-orange-400 font-mono text-xs">-F</code>)
          flag allows you to target specific applications or packages without
          changing directories:
        </p>

        <DocsCodeBlock
          code={`# Run Next.js app only
pnpm --filter web dev

# Run Hono API server only
pnpm --filter server dev

# Build only the UI package and its dependents
pnpm --filter @workspace/ui... build`}
          language="bash"
          title="Filter Syntax"
        />
      </section>

      {/* Adding Dependencies */}
      <section
        id="adding-dependencies"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Adding Dependencies
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Add an external package to a specific workspace directly from the
          root:
        </p>

        <DocsCodeBlock
          code={`# Add lucide-react to web application
pnpm --filter web add lucide-react

# Add dev dependency to shared UI package
pnpm --filter @workspace/ui add -D tailwindcss`}
          language="bash"
          title="Targeted Installation"
        />
      </section>

      {/* Parallel Execution */}
      <section
        id="parallel-scripts"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Parallel Script Execution
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          To run all applications concurrently in development mode, use{' '}
          <code className="text-orange-400 font-mono text-xs">pnpm -r</code>{' '}
          (recursive) or root npm scripts:
        </p>

        <DocsCodeBlock
          code={`# Run dev in all packages concurrently
pnpm -r --parallel dev`}
          language="bash"
          title="Parallel Execution"
        />
      </section>
    </div>
  );
};

export default WorkspaceContent;
