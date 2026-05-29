'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import {
  Check,
  Calendar,
  Terminal,
  Globe,
  Palette,
  Database,
  Laptop,
  Server,
  Cpu,
  Link2,
  FileSliders,
  Cog,
  Unlink,
} from 'lucide-react';

// Phase Data Interface for Morax
interface PhaseData {
  id: number;
  badge: string;
  tabLabel: string;
  icon: React.ReactNode;
  leftTitle: string;
  leftDesc: string;
  rightStatus: string;
}

const PHASES: PhaseData[] = [
  {
    id: 1,
    badge: '01-INTERACTIVE CONFIG',
    tabLabel: 'Workspace Config',
    icon: <FileSliders />,
    leftTitle: 'Define Your Monorepo Architecture',
    leftDesc:
      'Configure your monorepo parameters interactively in seconds. Choose your target apps (Next.js, Vite, Hono) and shared internal packages (UI, DB, configurations) through a modern, responsive developer CLI.',
    rightStatus: 'CONFIG ACTIVE',
  },
  {
    id: 2,
    badge: '02-DYNAMIC ORCHESTRATION',
    tabLabel: 'Scaffolding Engine',
    icon: <Cog />,
    leftTitle: 'Dynamic CLIs, Always Current Templates',
    leftDesc:
      'Instead of maintaining stale boilerplates, Morax acts as a smart orchestrator that dynamically executes official generators (like create-next-app and shadcn init) to guarantee you always run the latest features.',
    rightStatus: 'ORCHESTRATING 58%',
  },
  {
    id: 3,
    badge: '03-WORKSPACE RESOLUTION',
    tabLabel: 'Automatic Linking',
    icon: <Unlink />,
    leftTitle: 'Zero-Configuration Symlinking & Bootstrapping',
    leftDesc:
      'Morax programmatically injects local dependency symlinks ("@workspace/ui": "workspace:*"), automatically configures your workspace configurations, and bootstraps the monorepo cache via a global pnpm install.',
    rightStatus: 'BOOTSTRAPPED 100%',
  },
];

/* Component-wise Right Card Visuals for Morax */

/* Helper function to resolve Visual component based on active index */
const renderVisual = (id: number) => {
  switch (id) {
    case 1:
      return <InteractivePromptVisual />;
    case 2:
      return <DynamicScaffoldingVisual />;
    case 3:
      return <WorkspaceResolutionVisual />;
    default:
      return null;
  }
};

/* Main ProcessCards Component holding all logic */
const ProcessCards = () => {
  const [activeTab, setActiveTab] = useState<number>(1); // Default to Phase 2
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play stepper every 6 seconds
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setActiveTab((prev) => (prev === 3 ? 1 : prev + 1));
      }, 6000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  const handleTabSelect = (id: number) => {
    setActiveTab(id);
    setIsPlaying(false); // Pause auto-play on manual interaction
  };

  return (
    <>
      {/* Sleek Custom Stepper Menu */}
      <div className="max-w-2xl mx-auto mb-16 flex items-center justify-center gap-2 p-1 bg-zinc-950/60 border border-zinc-900 rounded-none shadow-inner">
        {PHASES.map((phase) => {
          const isActive = activeTab === phase.id;
          return (
            <button
              key={phase.id}
              onClick={() => handleTabSelect(phase.id)}
              className={cn(
                'relative flex-1 py-3 px-2 sm:px-4 font-mono text-[10px] sm:text-xs tracking-wider transition-all duration-300 select-none overflow-hidden outline-none flex flex-col md:flex-row items-center justify-center gap-1.5 md:gap-2 cursor-pointer',
                isActive
                  ? 'text-white font-medium bg-zinc-900 border border-zinc-800 shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200 border border-transparent ',
              )}
            >
              {/* Highlight bar */}
              {isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-orange-500 rounded-full shadow-[0_0_8px_#f97316]"></span>
              )}
              <span className="text-orange-500 w-4 h-4 flex items-center justify-center shrink-0">
                {phase.icon}
              </span>
              <span className="hidden md:inline mr-1 opacity-60">
                0{phase.id}
              </span>
              <span className="text-center font-sans text-[11px] sm:text-xs ">
                {phase.tabLabel}
              </span>
            </button>
          );
        })}
      </div>

      {/* Layout Grid */}
      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto"
        onMouseEnter={() => setIsPlaying(false)}
        onMouseLeave={() => setIsPlaying(true)}
      >
        {/* Left Card: Text & Phase Info */}
        <div className="relative min-h-[420px]  border border-dashed border-zinc-800 bg-[#0B0B0B] p-8 md:p-12 flex flex-col justify-between overflow-hidden shadow-2xl group hover:border-zinc-700/80 transition-all duration-500 font-fira-code">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-orange-500/5 blur-[120px] pointer-events-none group-hover:bg-orange-500/10 transition-all duration-500" />

          {/* Top Right Monospace Phase Badge */}
          <div className="flex justify-between items-center text-[10px] md:text-xs text-zinc-500 tracking-[0.15em] font-medium uppercase select-none">
            <div className="text-orange-500 flex items-center gap-1">
              <div className="size-2 animate-caret-blink bg-orange-500 rounded-full shadow-[0_0_8px_#f97316]"></div>
              {/* 0{activeTab} */}
            </div>
            {PHASES[activeTab - 1].badge}
          </div>

          {/* Heading and Description */}
          <div className="mt-auto z-10">
            <h3 className="text-lg md:text-xl text-white font-medium mb-5 tracking-tight leading-[1.2] transition-all duration-300">
              {PHASES[activeTab - 1].leftTitle}
            </h3>
            <p className="font-mono text-zinc-400 text-xs md:text-[13px] leading-relaxed transition-all duration-300 max-w-lg">
              {PHASES[activeTab - 1].leftDesc}
            </p>
          </div>
        </div>

        {/* Right Card: Visualization Wrapper */}
        <div className="relative min-h-[420px] border-dashed border border-zinc-800/80 bg-[#0B0B0B] p-8 md:p-10 flex items-center justify-center overflow-hidden shadow-2xl transition-all duration-500 font-fira-code ">
          {/* Top Right Status Monospace Label */}
          <div className="absolute top-6 right-8 font-mono text-xs text-orange-500 font-semibold tracking-wider select-none">
            {PHASES[activeTab - 1].rightStatus}
          </div>

          {/* Render Component-wise Visual */}
          <div className="w-full h-full flex items-center justify-center min-h-[300px]">
            {renderVisual(activeTab)}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProcessCards;

// 1. Interactive Config Visual (Phase 1)
export const InteractivePromptVisual = () => {
  return (
    <div className="w-full max-w-sm flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Sleek Terminal Box */}
      <div className="bg-[#060606] border border-zinc-900 rounded-none p-6 shadow-2xl flex flex-col gap-4.5 font-mono text-[11.5px] leading-[1.6]">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-3.5 mb-1.5 select-none">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
          </div>
          <span className="text-zinc-500 tracking-wider text-[10px]">
            MORAX CLI
          </span>
        </div>

        {/* Prompt contents */}
        <div className="flex flex-col gap-3">
          <div className="text-zinc-400">
            <span className="text-orange-500">$</span> npm create morax
          </div>

          <div className="text-zinc-100 flex flex-col gap-3.5 mt-3">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">?</span>
              <span className="font-sans font-medium text-xs text-zinc-300">
                What is the name of your monorepo?
              </span>
              <span className="text-orange-500">› my-app</span>
            </div>

            <div className="flex flex-col gap-2 mt-1.5 border-l border-zinc-900/80 pl-3.5">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">?</span>
                <span className="font-sans font-medium text-xs text-zinc-300">
                  Select applications in apps/:
                </span>
              </div>
              <div className="text-zinc-400 flex flex-col gap-1.5 pl-3 select-none">
                <div className="flex items-center gap-2 text-emerald-400">
                  <span>[x]</span>
                  <span>Next.js Application (web)</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <span>[x]</span>
                  <span>Vite + React Template (desktop)</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-600">
                  <span>[ ]</span>
                  <span>Hono API Framework (api)</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-1.5 border-l border-zinc-900/80 pl-3.5">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">?</span>
                <span className="font-sans font-medium text-xs text-zinc-300">
                  Select shared packages in packages/:
                </span>
              </div>
              <div className="text-zinc-400 flex flex-col gap-1.5 pl-3 select-none">
                <div className="flex items-center gap-2 text-emerald-400">
                  <span>[x]</span>
                  <span>Shared UI Components (@workspace/ui)</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <span>[x]</span>
                  <span>Database Schema Client (@workspace/db)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. Dynamic Scaffolding Visual (Phase 2 - Morax Orchestrator)
export const DynamicScaffoldingVisual = () => {
  return (
    <div className="w-full flex items-center justify-center relative animate-in fade-in slide-in-from-bottom-4 duration-500 select-none">
      <div className="w-full max-w-md flex items-center gap-4 relative">
        {/* Left Column: Flow Icons */}
        <div className="flex flex-col items-center justify-between h-48 py-2 relative z-10 font-sans">
          {/* Top: Terminal Shell Icon */}
          <div className="flex items-center justify-center w-12 h-12 bg-orange-500/5 border border-orange-500/20 rounded-none text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.05)]">
            <Terminal className="w-5.5 h-5.5" />
          </div>

          {/* Vertical connecting wire */}
          <div className="w-px bg-zinc-800/80 h-16 relative">
            <span className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[2px] h-6 bg-orange-500 shadow-[0_0_8px_#f97316]"></span>
          </div>

          {/* Bottom: Morax Engine Turbine Spinner */}
          <div className="flex items-center justify-center w-12 h-12 rounded-full relative bg-zinc-950 border border-zinc-900 shadow-md">
            <svg
              viewBox="0 0 100 100"
              className="w-9 h-9 text-zinc-300 animate-[spin_10s_linear_infinite]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="6 6"
                className="opacity-20"
              />
              <circle cx="50" cy="50" r="7" fill="currentColor" />
              <path
                d="M50 20 C56 34, 44 45, 50 45 C44 45, 32 34, 50 20 Z"
                fill="currentColor"
                transform="rotate(0 50 50)"
              />
              <path
                d="M50 20 C56 34, 44 45, 50 45 C44 45, 32 34, 50 20 Z"
                fill="currentColor"
                transform="rotate(45 50 50)"
              />
              <path
                d="M50 20 C56 34, 44 45, 50 45 C44 45, 32 34, 50 20 Z"
                fill="currentColor"
                transform="rotate(90 50 50)"
              />
              <path
                d="M50 20 C56 34, 44 45, 50 45 C44 45, 32 34, 50 20 Z"
                fill="currentColor"
                transform="rotate(135 50 50)"
              />
              <path
                d="M50 20 C56 34, 44 45, 50 45 C44 45, 32 34, 50 20 Z"
                fill="currentColor"
                transform="rotate(180 50 50)"
              />
              <path
                d="M50 20 C56 34, 44 45, 50 45 C44 45, 32 34, 50 20 Z"
                fill="currentColor"
                transform="rotate(225 50 50)"
              />
              <path
                d="M50 20 C56 34, 44 45, 50 45 C44 45, 32 34, 50 20 Z"
                fill="currentColor"
                transform="rotate(270 50 50)"
              />
              <path
                d="M50 20 C56 34, 44 45, 50 45 C44 45, 32 34, 50 20 Z"
                fill="currentColor"
                transform="rotate(315 50 50)"
              />
            </svg>
          </div>
        </div>

        {/* Horizontal connecting wire */}
        <div className="w-12 bg-zinc-800/85 h-px relative self-end mb-6">
          <span className="absolute top-1/2 left-1/3 -translate-y-1/2 w-6 h-[1.5px] bg-orange-500 shadow-[0_0_8px_#f97316]"></span>
        </div>

        {/* Right Column: Execution Shell Card */}
        <div className="flex-1 bg-[#060606] border border-zinc-900 rounded-none p-5 shadow-2xl relative font-sans">
          <div className="flex flex-col gap-3">
            <div className="border-b border-zinc-900 pb-3 flex items-center gap-1.5 text-xs">
              <span className="text-zinc-500">Executing:</span>
              <span className="text-zinc-100 font-semibold tracking-wide font-mono text-[10px]">
                npx create-next-app
              </span>
            </div>
            <p className="font-mono text-zinc-400 text-[11px] leading-relaxed select-text pr-1">
              Scaffolding web application in /apps/web. Downloading
              dependencies: react, react-dom, tailwindcss, typescript...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. Workspace Resolution Visual (Phase 3)
export const WorkspaceResolutionVisual = () => {
  return (
    <div className="w-full max-w-sm flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 select-none">
      {/* Dependency Links Graph */}
      <div className="bg-[#060606] border border-zinc-900 rounded-none p-5 shadow-2xl flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.15)]">
              <Check className="w-5 h-5" />
            </div>
            <div className="flex flex-col font-sans">
              <span className="font-mono text-[10px] text-zinc-500 tracking-wider">
                PNPM WORKSPACE
              </span>
              <span className="text-xs font-semibold text-zinc-100">
                Resolution Successful
              </span>
            </div>
          </div>
        </div>

        {/* Dependency Mapping List */}
        <div className="flex flex-col gap-2 font-mono text-[11px] leading-relaxed">
          {/* Item 1 */}
          <div className="bg-zinc-950/80 border border-zinc-900  p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-orange-500" />
              <span className="text-zinc-300">apps/web</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-500">
              <span>linked</span>
              <Link2 className="w-3.5 h-3.5 text-blue-400" />
            </div>
          </div>

          {/* Item 2 */}
          <div className="bg-zinc-950/80 border border-zinc-900 p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-orange-500" />
              <span className="text-zinc-300">@workspace/ui</span>
            </div>
            <span className="text-[10px] text-blue-400 bg-blue-950/25 px-2 py-0.5 rounded border border-blue-900/50">
              workspace:*
            </span>
          </div>

          {/* Item 3 */}
          <div className="bg-zinc-950/80 border border-zinc-900 p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-orange-500" />
              <span className="text-zinc-300">@workspace/db</span>
            </div>
            <span className="text-[10px] text-blue-400 bg-blue-950/25 px-2 py-0.5 rounded border border-blue-900/50">
              workspace:*
            </span>
          </div>
        </div>

        {/* Global check stats */}
        <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 px-1 pt-1 border-t border-zinc-900">
          <span>pnpm-workspace.yaml</span>
          <span className="text-blue-400">RESOLVED</span>
        </div>
      </div>
    </div>
  );
};
