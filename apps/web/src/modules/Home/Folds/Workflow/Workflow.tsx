'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Section from '@/Shared/Seaction/Section';
import SectionHeading from '../../components/SectionHeading';
import { cn } from '@/lib/utils';
import {
  TurbineSpinner,
  NextjsIcon,
  ReactIcon,
  ExpressIcon,
  ESLintIcon,
  PrettierIcon,
  HuskyIcon,
  GearIcon,
  LayersIcon,
} from './WorkflowIcons';

interface WorkflowFeature {
  id: number;
  title: string;
  desc: string;
  category: 'scaffolds' | 'configs';
  icon: React.ReactNode;
  badge: string;
}

const FEATURES: WorkflowFeature[] = [
  {
    id: 1,
    title: 'Next.js App Scaffold',
    desc: 'Automates high-performance React framework app setup in apps/web with shadcn UI configurations.',
    category: 'scaffolds',
    icon: <NextjsIcon />,
    badge: 'FRONTEND',
  },
  {
    id: 2,
    title: 'React (Vite) Starter',
    desc: 'Instantly generates a lightweight Vite + React template pre-configured with extendable TypeScript.',
    category: 'scaffolds',
    icon: <ReactIcon />,
    badge: 'FRONTEND',
  },
  {
    id: 3,
    title: 'Express.js API Backend',
    desc: 'Generates a modular, robust Node/Express server inside apps/server with TypeScript paths.',
    category: 'scaffolds',
    icon: <ExpressIcon />,
    badge: 'BACKEND',
  },
  {
    id: 4,
    title: 'ESLint Flat Configs',
    desc: 'Configures ESLint Flat Configs sharing a unified workspace standard across the entire monorepo.',
    category: 'configs',
    icon: <ESLintIcon />,
    badge: 'LINTER',
  },
  {
    id: 5,
    title: 'Prettier Formatter',
    desc: 'Deploys workspace-wide auto-formatting scripts and formatting rule standards on code save.',
    category: 'configs',
    icon: <PrettierIcon />,
    badge: 'FORMATTER',
  },
  {
    id: 6,
    title: 'Husky & Git Hooks',
    desc: 'Sets up Git pre-commit hooks to automate linters and ensure push protection and clean PRs.',
    category: 'configs',
    icon: <HuskyIcon />,
    badge: 'GIT HOOKS',
  },
];

const Workflow = () => {
  const [activeId, setActiveId] = useState<number>(1);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Auto-play selector when not hovered
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveId((prev) => (prev === 6 ? 1 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered]);

  const activeFeature = FEATURES.find((f) => f.id === activeId) || FEATURES[0];
  const isScaffoldsActive = activeFeature.category === 'scaffolds';
  const isConfigsActive = activeFeature.category === 'configs';

  return (
    <Section className={cn('py-24 text-white overflow-hidden relative')}>
      {/* Decorative subtle background light */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className={cn('container mx-auto max-w-6xl')}>
        {/* Section Heading */}
        <SectionHeading
          badge="CLI WORKFLOW"
          title="Supercharged CLI. Total Workspace Orchestration."
          description="Morax prompts for your configuration rules, executes framework CLIs concurrently, and links shared dependencies automatically."
        />

        {/* Desktop grid layout */}
        <div
          className={cn(
            'grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mt-12 relative',
          )}
        >
          {/* Left/Center dynamic SVG wire map */}
          <div
            className={cn(
              'lg:col-span-7 flex flex-col items-center justify-center relative w-full max-w-[550px] aspect-square mx-auto bg-black border border-zinc-700 border-dashed p-6 shadow-2xl backdrop-blur-sm rounded-none',
            )}
          >
            <div
              className={cn(
                'absolute top-4 left-6 font-mono text-[10px] text-zinc-500 tracking-wider',
              )}
            >
              DYNAMIC PIPELINE ORCHESTRATION
            </div>

            {/* The SVG curve connector wires */}
            <svg
              viewBox="0 0 400 400"
              className={cn('w-full h-full pointer-events-none z-0')}
            >
              <defs>
                <linearGradient
                  id="activeGlow"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#ea580c" stopOpacity="1" />
                  <stop offset="100%" stopColor="#fdba74" stopOpacity="0.6" />
                </linearGradient>
                <filter
                  id="glowFilter"
                  x="-10%"
                  y="-10%"
                  width="120%"
                  height="120%"
                >
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Wire 1: Turbine -> Config Engine Node (Top) */}
              <path
                d="M 50,200 L 100,200 C 120,200 120,110 140,110 L 160,110"
                fill="none"
                stroke={isConfigsActive ? '#ea580c' : '#27272a'}
                strokeWidth={isConfigsActive ? '2.5' : '1.5'}
                strokeDasharray="6, 4"
                className={cn(
                  'transition-all duration-500',
                  isConfigsActive && 'animate-workflow-dash',
                )}
                filter={isConfigsActive ? 'url(#glowFilter)' : undefined}
                opacity={isConfigsActive ? 1 : 0.4}
              />

              {/* Wire 2: Turbine -> Scaffold Core Node (Bottom) */}
              <path
                d="M 50,200 L 100,200 C 120,200 120,290 140,290 L 160,290"
                fill="none"
                stroke={isScaffoldsActive ? '#ea580c' : '#27272a'}
                strokeWidth={isScaffoldsActive ? '2.5' : '1.5'}
                strokeDasharray="6, 4"
                className={cn(
                  'transition-all duration-500',
                  isScaffoldsActive && 'animate-workflow-dash',
                )}
                filter={isScaffoldsActive ? 'url(#glowFilter)' : undefined}
                opacity={isScaffoldsActive ? 1 : 0.4}
              />

              {/* Wire 3: Config Engine Node -> Right merge border */}
              <path
                d="M 240,110 L 260,110 C 280,110 280,200 300,200 L 400,200"
                fill="none"
                stroke={isConfigsActive ? '#ea580c' : '#27272a'}
                strokeWidth={isConfigsActive ? '2.5' : '1.5'}
                strokeDasharray="6, 4"
                className={cn(
                  'transition-all duration-500',
                  isConfigsActive && 'animate-workflow-dash',
                )}
                filter={isConfigsActive ? 'url(#glowFilter)' : undefined}
                opacity={isConfigsActive ? 1 : 0.4}
              />

              {/* Wire 4: Scaffold Core Node -> Right merge border */}
              <path
                d="M 240,290 L 260,290 C 280,290 280,200 300,200 L 400,200"
                fill="none"
                stroke={isScaffoldsActive ? '#ea580c' : '#27272a'}
                strokeWidth={isScaffoldsActive ? '2.5' : '1.5'}
                strokeDasharray="6, 4"
                className={cn(
                  'transition-all duration-500',
                  isScaffoldsActive && 'animate-workflow-dash',
                )}
                filter={isScaffoldsActive ? 'url(#glowFilter)' : undefined}
                opacity={isScaffoldsActive ? 1 : 0.4}
              />
            </svg>

            {/* Absolute Placed Turbine Logo (Left) */}
            <div
              className={cn(
                'absolute left-[12.5%] top-[50%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center',
              )}
            >
              <TurbineSpinner
                className={cn('w-[60px] h-[60px] md:w-[70px] md:h-[70px]')}
                active={isHovered || activeId > 0}
              />
              <div
                className={cn(
                  'font-mono text-[8px] text-zinc-500 mt-2 uppercase tracking-wider bg-zinc-950 px-1.5 py-0.5 rounded-none border border-zinc-900 whitespace-nowrap',
                )}
              >
                CLI Core
              </div>
            </div>

            {/* Absolute Placed Configuration Engine (Top Middle Node) */}
            <div
              className={cn(
                'absolute left-[50%] top-[27.5%] -translate-x-1/2 -translate-y-1/2 z-10',
              )}
            >
              <div
                className={cn(
                  'border bg-zinc-950/90 rounded-none p-3 flex flex-col items-center justify-center gap-1.5 w-[110px] h-[95px] text-center transition-all duration-500',
                  isConfigsActive
                    ? 'border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.15)] bg-zinc-900/90 scale-105'
                    : 'border-zinc-800 opacity-60 scale-100 hover:opacity-100',
                )}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-none bg-zinc-900 border border-zinc-800 flex items-center justify-center',
                  )}
                >
                  <GearIcon
                    active={isConfigsActive}
                    className={cn(
                      isConfigsActive
                        ? 'animate-spin animation-duration-[15s]'
                        : '',
                    )}
                  />
                </div>
                <div
                  className={cn(
                    'font-mono text-[9px] text-zinc-400 uppercase tracking-widest font-semibold',
                  )}
                >
                  Configs
                </div>
                <div className={cn('font-mono text-[8px] text-zinc-500')}>
                  Lints & Rules
                </div>
              </div>
            </div>

            {/* Absolute Placed Scaffolding Core (Bottom Middle Node) */}
            <div
              className={cn(
                'absolute left-[50%] top-[72.5%] -translate-x-1/2 -translate-y-1/2 z-10',
              )}
            >
              <div
                className={cn(
                  'border bg-zinc-950/90 rounded-none p-3 flex flex-col items-center justify-center gap-1.5 w-[110px] h-[95px] text-center transition-all duration-500',
                  isScaffoldsActive
                    ? 'border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.15)] bg-zinc-900/90 scale-105'
                    : 'border-zinc-800 opacity-60 scale-100 hover:opacity-100',
                )}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-none bg-zinc-900 border border-zinc-800 flex items-center justify-center',
                  )}
                >
                  <LayersIcon
                    active={isScaffoldsActive}
                    className={cn(isScaffoldsActive ? 'animate-pulse' : '')}
                  />
                </div>
                <div
                  className={cn(
                    'font-mono text-[9px] text-zinc-400 uppercase tracking-widest font-semibold',
                  )}
                >
                  Scaffolding
                </div>
                <div className={cn('font-mono text-[8px] text-zinc-500')}>
                  Apps & Setup
                </div>
              </div>
            </div>

            {/* Glowing intersection status indicator */}
            <div
              className={cn(
                'absolute right-[4%] top-[50%] -translate-x-1/2 -translate-y-1/2 z-10',
              )}
            >
              <span
                className={cn(
                  'flex h-2 w-2 relative',
                  isScaffoldsActive ? 'text-orange-500' : 'text-orange-400',
                )}
              >
                <span
                  className={cn(
                    'animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75',
                  )}
                ></span>
                <span
                  className={cn(
                    'relative inline-flex rounded-full h-2 w-2 bg-orange-500',
                  )}
                ></span>
              </span>
            </div>

            {/* Dynamic Physical Connection Bridge (Bridges Left & Right Blocks) */}
            <div
              className={cn(
                'hidden lg:block absolute left-full top-[50%] -translate-y-1/2 w-12 h-[2px] z-20 overflow-visible',
              )}
            >
              {/* Glowing Bridge Line */}
              <div
                className={cn(
                  'w-full h-full transition-all duration-500 animate-pulse',
                  isScaffoldsActive
                    ? 'bg-linear-to-r from-orange-500 to-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.6)]'
                    : 'bg-linear-to-r from-orange-500 to-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.6)]',
                )}
              />

              {/* Floating Real-time status text badge */}
              <div
                className={cn(
                  'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-2.5 py-0.5 bg-black border text-[8px] font-mono whitespace-nowrap uppercase tracking-widest transition-all duration-300 rounded-none font-bold',
                  isScaffoldsActive
                    ? 'border-orange-500 text-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.3)]'
                    : 'border-orange-500 text-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.3)]',
                )}
              >
                {activeFeature.id === 1 && 'Scaffolding Next.js'}
                {activeFeature.id === 2 && 'Scaffolding Vite'}
                {activeFeature.id === 3 && 'Deploying Express'}
                {activeFeature.id === 4 && 'Injecting Flat ESLint'}
                {activeFeature.id === 5 && 'Applying Prettier'}
                {activeFeature.id === 6 && 'Activating Git Hooks'}
              </div>
            </div>
          </div>

          {/* Right column: Sleek boxed vertical features list */}
          <div
            className={cn('lg:col-span-5 flex flex-col h-full justify-between')}
          >
            <div
              className={cn(
                'border border-zinc-700 border-dashed bg-black p-4 md:p-6 flex flex-col gap-3 shadow-2xl backdrop-blur-md rounded-none',
              )}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div
                className={cn(
                  'flex items-center justify-between border-b border-zinc-900 pb-3 mb-2',
                )}
              >
                <span
                  className={cn(
                    'font-mono text-[10px] text-zinc-500 uppercase tracking-wider',
                  )}
                >
                  Select CLI Capabilities
                </span>
                <span
                  className={cn(
                    'font-mono text-[9px] text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-none border border-orange-500/20',
                  )}
                >
                  {FEATURES.length} features active
                </span>
              </div>

              {/* Feature Cards Loop */}
              <div className={cn('flex flex-col gap-2')}>
                {FEATURES.map((feature) => {
                  const isActive = feature.id === activeId;
                  return (
                    <div
                      key={feature.id}
                      onClick={() => setActiveId(feature.id)}
                      onMouseEnter={() => setActiveId(feature.id)}
                      className={cn(
                        'flex items-center gap-4 p-3 rounded-none border transition-all duration-300 cursor-pointer select-none',
                        isActive
                          ? 'bg-zinc-900/60 border-zinc-800 shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
                          : 'bg-transparent border-transparent hover:bg-zinc-900/20 hover:border-zinc-900',
                      )}
                    >
                      {/* Icon container box */}
                      <div
                        className={cn(
                          'w-11 h-11 rounded-none flex items-center justify-center bg-zinc-900 border border-zinc-800/80 transition-all duration-300',
                          isActive &&
                            'bg-orange-500/10 border-orange-500/30 text-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.15)]',
                        )}
                      >
                        {React.cloneElement(
                          feature.icon as React.ReactElement<{
                            active?: boolean;
                          }>,
                          { active: isActive },
                        )}
                      </div>

                      {/* Content */}
                      <div className={cn('flex-1')}>
                        <div
                          className={cn('flex items-center justify-between')}
                        >
                          <h3
                            className={cn(
                              'text-sm font-semibold tracking-tight transition-colors duration-300',
                              isActive ? 'text-white' : 'text-zinc-400',
                            )}
                          >
                            {feature.title}
                          </h3>
                          <span
                            className={cn(
                              'font-mono text-[8px] px-1.5 py-0.2 rounded-none border transition-colors duration-300',
                              isActive
                                ? 'text-orange-500 bg-orange-500/10 border-orange-500/20'
                                : 'text-zinc-600 bg-zinc-950/50 border-zinc-900',
                            )}
                          >
                            {feature.badge}
                          </span>
                        </div>
                        <p
                          className={cn(
                            'text-[11px] leading-relaxed mt-0.5 transition-all duration-300',
                            isActive ? 'text-zinc-300' : 'text-zinc-500',
                          )}
                        >
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic console/terminal execution output preview footer */}
              <div
                className={cn(
                  'border-t border-zinc-900 pt-4 mt-3 flex flex-col gap-2',
                )}
              >
                <div
                  className={cn(
                    'flex items-center justify-between font-mono text-[9px] text-zinc-500',
                  )}
                >
                  <span>COMMAND SIMULATION:</span>
                  <span className={cn('text-zinc-600')}>pnpm create morax</span>
                </div>
                <div
                  className={cn(
                    'bg-zinc-950 border border-zinc-900 rounded-none p-3 font-mono text-[10px] text-orange-500/80 flex items-center gap-2 overflow-hidden h-[36px]',
                  )}
                >
                  <span className={cn('text-zinc-600 shrink-0')}>Morax $</span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={activeId}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      className={cn('text-zinc-300 truncate')}
                    >
                      {activeFeature.category === 'scaffolds'
                        ? `✔ Scaffolding ${activeFeature.title} inside apps/...`
                        : `✔ Deploying workspace-wide ${activeFeature.title} files...`}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Workflow;
