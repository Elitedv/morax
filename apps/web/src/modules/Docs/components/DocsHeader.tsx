/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMoraxVersion } from '@/hooks/moraxVersion';

interface DocsHeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  className?: string;
}

export const DocsHeader = ({
  isSidebarOpen,
  onToggleSidebar,
  className,
}: DocsHeaderProps) => {
  const { data: version } = useMoraxVersion();
  const pathname = usePathname();

  const isInstallationActive = pathname === '/docs/installation';
  const isAiAgentActive = pathname === '/docs/ai-skills';
  const isWorkflowActive = pathname === '/docs/workspace';
  const isDocsActive =
    !isInstallationActive && !isAiAgentActive && !isWorkflowActive;

  const navLinks = [
    { label: 'DOCS', href: '/docs', isActive: isDocsActive },
    {
      label: 'INSTALLATION',
      href: '/docs/installation',
      isActive: isInstallationActive,
    },
    { label: 'AI AGENT', href: '/docs/ai-skills', isActive: isAiAgentActive },
    { label: 'WORKFLOW', href: '/docs/workspace', isActive: isWorkflowActive },
  ];

  return (
    <header
      className={cn(
        'w-full border-b border-zinc-900 bg-black sticky top-0 z-50 select-none font-fira-code',
        className,
      )}
    >
      <div className="w-full flex items-stretch h-12">
        {/* Left Brand Area (Aligned with sidebar width and border-r) */}
        <div className="w-64 xl:w-72 shrink-0 border-r border-zinc-900 flex items-center justify-between px-5 bg-black">
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* Morax Favicon Logo */}
            <div className="size-6 rounded flex items-center justify-center bg-zinc-900 border border-zinc-800 transition-colors">
              <img
                src="/favicon/favicon.svg"
                alt="Morax"
                className="w-4 h-4 object-contain"
              />
            </div>
            <span className="font-mono font-bold tracking-wider text-sm text-white group-hover:text-orange-500 transition-colors">
              MORAX.
            </span>
          </Link>

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={onToggleSidebar}
            className="md:hidden p-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer border border-zinc-800"
            aria-label="Toggle navigation sidebar"
          >
            {isSidebarOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Center Nav Tabs & Right Actions */}
        <div className="flex-1 flex items-center justify-between pr-0 sm:pr-6 overflow-x-auto">
          {/* Horizontal Nav Tabs (Mapped from object) */}
          <nav className="flex items-stretch h-full">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  'h-full px-10 flex items-center text-xs font-mono tracking-wider transition-colors border-r border-zinc-900',
                  link.isActive
                    ? 'text-white font-semibold relative bg-zinc-950/40'
                    : 'text-zinc-400 hover:text-white',
                )}
              >
                {link.isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-400 shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
                )}
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Action Links */}
          <div className="hidden sm:flex items-center gap-4 px-4 sm:px-0">
            <a
              href="https://github.com/Elitedv/morax"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
              <span className="hidden lg:inline">GitHub</span>
            </a>

            {/* Version Badge - Only rendered if version is successfully fetched (no fallback) */}
            {version && (
              <a
                href="https://www.npmjs.com/package/create-morax"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>{version}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DocsHeader;
