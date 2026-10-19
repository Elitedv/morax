'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import DocsHeader from '@/modules/Docs/components/DocsHeader';

export default function DocSlugNotFound() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const availableDocs = [
    {
      title: 'Introduction',
      href: '/docs',
      desc: 'Overview, philosophy, and key features',
    },
    {
      title: 'Comparison',
      href: '/docs/comparison',
      desc: 'Morax vs boilerplates and Turborepo',
    },
    {
      title: 'Installation',
      href: '/docs/installation',
      desc: 'Run with npm, pnpm, bun, or global CLI',
    },
    {
      title: 'Basic Usage',
      href: '/docs/basic-usage',
      desc: 'Interactive wizard and monorepo structure',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Top Navbar */}
      <DocsHeader
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      <main className="flex-1 flex flex-col items-center justify-center p-6 font-fira-code">
        <div className="max-w-xl w-full flex flex-col gap-8">
          {/* Main 404 Title */}
          <div className="flex flex-col items-center text-center gap-2">
            <h1 className="font-mono text-6xl sm:text-7xl font-black tracking-tight text-white select-none">
              4<span className="text-orange-500">0</span>4
            </h1>

            <h2 className="text-xl sm:text-2xl font-sans font-semibold text-white tracking-tight">
              Looking for documentation?
            </h2>

            <p className="text-zinc-400 font-sans text-xs sm:text-sm leading-relaxed max-w-sm mt-1">
              The requested doc path does not exist. Choose one of our available
              guides:
            </p>
          </div>

          {/* Available Docs Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {availableDocs.map((doc) => (
              <Link
                key={doc.title}
                href={doc.href}
                className="p-4 bg-zinc-950/60 hover:bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-colors group flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-white font-medium text-sm group-hover:text-orange-400 transition-colors">
                    {doc.title}
                  </h3>
                  <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                    {doc.desc}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs text-orange-400 font-mono mt-3">
                  <span>Open Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>

          <div className="pt-2 text-center">
            <Link
              href="/"
              className="text-xs text-zinc-500 hover:text-zinc-300 font-mono underline underline-offset-4 transition-colors"
            >
              ← Return to Morax Homepage
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
