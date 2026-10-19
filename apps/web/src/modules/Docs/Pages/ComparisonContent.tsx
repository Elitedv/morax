'use client';

import React from 'react';
import Link from 'next/link';
import { Check, X, ArrowRight } from 'lucide-react';

export const COMPARISON_TOC = [
  { id: 'overview', label: 'Overview' },
  { id: 'comparison-matrix', label: 'Feature Matrix' },
  { id: 'vs-boilerplates', label: 'vs. Boilerplates' },
  { id: 'vs-turborepo', label: 'vs. Turborepo' },
  { id: 'vs-manual', label: 'vs. Manual Setup' },
];

export const ComparisonContent = () => {
  return (
    <div className="space-y-12">
      {/* Overview */}
      <section id="overview" className="space-y-4">
        <p className="text-base text-zinc-300 leading-relaxed font-light">
          When initiating a multi-package repository, developers traditionally
          face three choices: clone a community boilerplate on GitHub, assemble
          official tools manually, or stitch complex monorepo configs together.
        </p>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Morax takes a different architectural approach: an interactive,
          dynamic orchestrator built natively on top of{' '}
          <span className="text-orange-400 font-mono">pnpm workspaces</span>{' '}
          that programs official CLIs and resolves local package links
          seamlessly.
        </p>
      </section>

      {/* Feature Matrix Table */}
      <section
        id="comparison-matrix"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Feature Matrix
        </h2>
        <div className="overflow-x-auto border border-zinc-800 bg-[#080808] font-fira-code text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/80 text-zinc-400">
                <th className="p-3.5 font-medium">Capability</th>
                <th className="p-3.5 font-semibold text-orange-400">Morax</th>
                <th className="p-3.5 font-medium">Static Boilerplates</th>
                <th className="p-3.5 font-medium">Turborepo Only</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 text-zinc-300">
              <tr>
                <td className="p-3.5 font-medium text-white">
                  Always-Latest Generator Versions
                </td>
                <td className="p-3.5 text-emerald-400">
                  <Check className="w-4 h-4" />
                </td>
                <td className="p-3.5 text-zinc-600">
                  <X className="w-4 h-4" />
                </td>
                <td className="p-3.5 text-zinc-600">
                  <X className="w-4 h-4" />
                </td>
              </tr>
              <tr>
                <td className="p-3.5 font-medium text-white">
                  Interactive Custom App Selection
                </td>
                <td className="p-3.5 text-emerald-400">
                  <Check className="w-4 h-4" />
                </td>
                <td className="p-3.5 text-zinc-600">
                  <X className="w-4 h-4" />
                </td>
                <td className="p-3.5 text-zinc-600">
                  <X className="w-4 h-4" />
                </td>
              </tr>
              <tr>
                <td className="p-3.5 font-medium text-white">
                  Automatic Local Package Symlinks (@workspace/*)
                </td>
                <td className="p-3.5 text-emerald-400">
                  <Check className="w-4 h-4" />
                </td>
                <td className="p-3.5 text-zinc-400 font-mono">Partial</td>
                <td className="p-3.5 text-zinc-400 font-mono">Manual</td>
              </tr>
              <tr>
                <td className="p-3.5 font-medium text-white">
                  Zero Maintenance Burden on User
                </td>
                <td className="p-3.5 text-emerald-400">
                  <Check className="w-4 h-4" />
                </td>
                <td className="p-3.5 text-zinc-600">
                  <X className="w-4 h-4" />
                </td>
                <td className="p-3.5 text-zinc-400 font-mono">Moderate</td>
              </tr>
              <tr>
                <td className="p-3.5 font-medium text-white">
                  Native PNPM Workspaces Integration
                </td>
                <td className="p-3.5 text-emerald-400">
                  <Check className="w-4 h-4" />
                </td>
                <td className="p-3.5 text-zinc-400 font-mono">Varies</td>
                <td className="p-3.5 text-emerald-400">
                  <Check className="w-4 h-4" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* vs. Boilerplates */}
      <section
        id="vs-boilerplates"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Morax vs. Static Boilerplates
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Static starter repositories clone a frozen git tree onto your machine.
          If that boilerplate hasn’t been updated in 2 months, you receive
          outdated packages, legacy ESLint configs, and deprecated Next.js or
          React router versions.
        </p>
        <p className="text-zinc-400 text-sm leading-relaxed">
          In contrast, Morax invokes the official generators on-demand (e.g.{' '}
          <code className="text-zinc-200 font-mono text-xs bg-zinc-900 px-1.5 py-0.5 border border-zinc-800">
            create-next-app@latest
          </code>
          ) and injects only clean, tailored monorepo glue code. You always
          receive today’s latest stable release.
        </p>
      </section>

      {/* vs. Turborepo */}
      <section
        id="vs-turborepo"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Morax vs. Turborepo
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Turborepo is an incredible build system for pipeline caching and
          running tasks in parallel. However, Turborepo’s default starter
          templates (
          <code className="text-zinc-200 font-mono text-xs bg-zinc-900 px-1.5 py-0.5 border border-zinc-800">
            create-turbo
          </code>
          ) are fixed, minimal, and do not offer modular selections for varied
          backend frameworks, custom UI setups, or interactive configurations.
        </p>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Morax focuses on the{' '}
          <strong>scaffolding and linking experience</strong>. You can even
          combine Turborepo build caching into Morax-bootstrapped workspaces
          seamlessly.
        </p>
      </section>

      {/* vs. Manual Setup */}
      <section
        id="vs-manual"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Morax vs. Manual Setup
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Configuring a monorepo manually requires drafting{' '}
          <code className="text-zinc-200 font-mono text-xs bg-zinc-900 px-1.5 py-0.5 border border-zinc-800">
            pnpm-workspace.yaml
          </code>
          , wiring up root{' '}
          <code className="text-zinc-200 font-mono text-xs bg-zinc-900 px-1.5 py-0.5 border border-zinc-800">
            package.json
          </code>
          , linking relative paths in each workspace’s package dependencies,
          configuring TypeScript path aliases, and ensuring shared UI components
          bundle correctly.
        </p>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Morax reduces this 45-minute error-prone process to a 10-second
          interactive CLI session.
        </p>
        <div className="pt-4">
          <Link
            href="/docs/installation"
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-black font-semibold text-xs font-mono transition-colors"
          >
            <span>Proceed to Installation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ComparisonContent;
