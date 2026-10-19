'use client';
import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export const INTRODUCTION_TOC = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'philosophy', label: 'Philosophy' },
  { id: 'features', label: 'Key Features' },
  { id: 'next-steps', label: 'Next Steps' },
];

export const IntroductionContent = () => {
  return (
    <div className="space-y-12">
      {/* Overview */}
      <section id="introduction" className="space-y-4">
        <p className="text-base text-zinc-300 leading-relaxed font-light">
          <strong className="text-white font-medium">Morax</strong> is a
          framework-agnostic, interactive CLI and dynamic orchestration engine
          for bootstrapping production-grade{' '}
          <span className="text-orange-400 font-mono text-sm">
            pnpm workspaces
          </span>{' '}
          monorepos in seconds.
        </p>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Instead of locking you into frozen boilerplates and outdated
          templates, Morax operates as a smart orchestrator. It executes the
          official generators dynamically (such as{' '}
          <code className="text-zinc-200 font-mono text-xs bg-zinc-900 px-1.5 py-0.5 border border-zinc-800">
            create-next-app
          </code>
          ), injects local workspace symlinks (
          <code className="text-zinc-200 font-mono text-xs bg-zinc-900 px-1.5 py-0.5 border border-zinc-800">
            @workspace/*
          </code>
          ), and wires shared tooling automatically.
        </p>
      </section>

      {/* Philosophy */}
      <section
        id="philosophy"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Design Philosophy
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Traditional starter kits require constant manual maintenance from
          maintainers. As React, Next.js, and TypeScript release newer versions,
          cloneable template repos become stale within months.
        </p>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Morax separates{' '}
          <strong className="text-zinc-200">the generation</strong> from{' '}
          <strong className="text-zinc-200">the orchestration</strong>. Official
          tools build the apps; Morax wires the monorepo architecture,
          dependency symlinks, and root configs.
        </p>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="space-y-6 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Key Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-fira-code">
          {[
            {
              title: 'Zero-Config Workspaces',
              desc: 'Dynamically initializes compliant pnpm-workspace.yaml and root configs in seconds.',
            },
            {
              title: 'Dynamic Orchestration',
              desc: 'Runs official generators on the fly so you always get the latest framework updates.',
            },
            {
              title: 'Automatic Symlinks',
              desc: 'Programmatically wires cross-package dependencies with local "workspace:*" targets.',
            },
            {
              title: 'Shared UI & Configs',
              desc: 'Bundles pre-linked Tailwind CSS configurations, TypeScript base, and UI modules.',
            },
          ].map((feat) => (
            <div
              key={feat.title}
              className="p-4 bg-[#080808] border border-zinc-800/80 flex flex-col gap-2"
            >
              <div className="flex items-center gap-2 text-orange-400 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                <span>{feat.title}</span>
              </div>
              <p className="text-zinc-400 text-xs font-mono leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Next Steps */}
      <section
        id="next-steps"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Next Steps
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/docs/comparison"
            className="p-4 border border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 hover:bg-zinc-900/40 transition-colors group flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-mono text-zinc-500">
                Next Article
              </span>
              <h3 className="text-white font-medium text-base group-hover:text-orange-400 transition-colors mt-1">
                Comparison & Tradeoffs
              </h3>
              <p className="text-zinc-400 text-xs mt-1">
                Learn how Morax compares to starter repos and manual setups.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-orange-400 font-mono mt-3">
              <span>Read Comparison</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/docs/installation"
            className="p-4 border border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 hover:bg-zinc-900/40 transition-colors group flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-mono text-zinc-500">
                Jump Straight In
              </span>
              <h3 className="text-white font-medium text-base group-hover:text-orange-400 transition-colors mt-1">
                Installation Guide
              </h3>
              <p className="text-zinc-400 text-xs mt-1">
                Run Morax with npm, pnpm, bun, or global install.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-orange-400 font-mono mt-3">
              <span>Install Morax</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default IntroductionContent;
