'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Terminal, Cpu } from 'lucide-react';
import DocsCodeBlock from '../components/DocsCodeBlock';

export const INSTALLATION_TOC = [
  { id: 'prerequisites', label: 'Prerequisites' },
  { id: 'quick-command', label: 'Quick Start' },
  { id: 'package-managers', label: 'Package Managers' },
  { id: 'global-install', label: 'Global CLI' },
  { id: 'next-steps', label: 'Next Steps' },
];

export const InstallationContent = () => {
  return (
    <div className="space-y-12">
      {/* Prerequisites */}
      <section id="prerequisites" className="space-y-4">
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Prerequisites
        </h2>
        <p className="text-zinc-300 text-sm leading-relaxed">
          Before running Morax, ensure your local development environment meets
          the following baseline requirements:
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm text-zinc-400 font-mono">
          <li>
            <strong className="text-white font-sans">Node.js:</strong> Version{' '}
            <code className="text-orange-400">18.17.0</code> or higher (LTS
            recommended)
          </li>
          <li>
            <strong className="text-white font-sans">PNPM:</strong> Version{' '}
            <code className="text-orange-400">8.0.0</code> or{' '}
            <code className="text-orange-400">9.0.0+</code> (
            <code className="text-zinc-300">npm i -g pnpm</code>)
          </li>
          <li>
            <strong className="text-white font-sans">Git:</strong> Installed and
            configured for initial workspace git commits
          </li>
        </ul>
      </section>

      {/* Quick Command */}
      <section
        id="quick-command"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Quick Start (No Install Needed)
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          You don’t need to install anything globally. You can run Morax
          directly using your preferred runner:
        </p>
        <DocsCodeBlock
          code="npm create morax@latest"
          language="bash"
          title="npm"
        />
      </section>

      {/* Package Managers */}
      <section
        id="package-managers"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Run with Different Package Managers
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Morax supports all popular JavaScript package managers:
        </p>

        <div className="space-y-4 font-fira-code">
          <div>
            <span className="text-xs text-orange-400 font-mono font-medium block mb-1">
              PNPM (Recommended)
            </span>
            <DocsCodeBlock
              code="pnpm create morax@latest"
              language="bash"
              title="pnpm"
            />
          </div>

          <div>
            <span className="text-xs text-orange-400 font-mono font-medium block mb-1">
              Bun
            </span>
            <DocsCodeBlock
              code="bun create morax@latest"
              language="bash"
              title="bun"
            />
          </div>

          <div>
            <span className="text-xs text-orange-400 font-mono font-medium block mb-1">
              Yarn
            </span>
            <DocsCodeBlock
              code="yarn create morax"
              language="bash"
              title="yarn"
            />
          </div>
        </div>
      </section>

      {/* Global Installation */}
      <section
        id="global-install"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Global CLI Installation (Optional)
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          If you prefer having the{' '}
          <code className="text-zinc-200 font-mono text-xs bg-zinc-900 px-1.5 py-0.5 border border-zinc-800">
            morax
          </code>{' '}
          command available globally in your terminal:
        </p>
        <DocsCodeBlock
          code={`# Install globally via pnpm\npnpm add -g create-morax\n\n# Or via npm\nnpm install -g create-morax\n\n# Run anytime with\nmorax`}
          language="bash"
          title="Global Install"
        />
      </section>

      {/* Next Steps */}
      <section
        id="next-steps"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Ready to Scaffolding
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Once installed or executed, follow the interactive prompts to define
          your monorepo apps and packages.
        </p>
        <div className="pt-2">
          <Link
            href="/docs/basic-usage"
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-black font-semibold text-xs font-mono transition-colors"
          >
            <span>Read Basic Usage Walkthrough</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default InstallationContent;
