'use client';

import React from 'react';
import { FolderGit2, Cpu, Zap, Palette, Database, Link2 } from 'lucide-react';
import {
  WorkspaceConfigWireframe,
  DatabaseWireframe,
  ScaffoldingEngineWireframe,
  SharedUiWireframe,
  SymlinkWireframe,
  TurborepoWireframe,
} from './FeatureIcons';

/* Unified Feature Wireframe Container */
interface WireframeWrapperProps {
  children: React.ReactNode;
  backdrop: React.ReactNode;
}

const WireframeWrapper = ({ children, backdrop }: WireframeWrapperProps) => {
  return (
    <div className="relative w-full h-32 flex items-center justify-center mb-6 overflow-visible select-none group font-sans">
      {/* 3D Geometric wireframe backdrops */}
      <div className="absolute inset-0 flex items-center justify-center opacity-40 group-hover:opacity-65 group-hover:scale-105 transition-all duration-500 pointer-events-none">
        {backdrop}
      </div>
      {/* Soft orange glowing center backdrop */}
      <div className="absolute w-16 h-16 rounded-full bg-orange-500/5 blur-xl group-hover:bg-orange-500/10 transition-all duration-500"></div>
      {/* Core Lucide Center Icon */}
      <div className="relative z-10 text-orange-500 transform group-hover:scale-125 transition-transform duration-500 shadow-sm">
        {children}
      </div>
    </div>
  );
};

/* Card Interface */
interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  backdrop: React.ReactNode;
}

/* Individual Feature Card Component */
export const FeatureCard = ({
  title,
  description,
  icon,
  backdrop,
}: FeatureCardProps) => {
  return (
    <div className="relative bg-[#0B0B0B] border border-zinc-700 border-dashed p-8 hover:border-zinc-800/80 hover:bg-[#0d0d0d] transition-all duration-500 shadow-2xl flex flex-col group select-text">
      {/* Soft visual top gradient blur */}
      <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-orange-500/2 blur-[90px] pointer-events-none group-hover:bg-orange-500/4 transition-all duration-500" />

      {/* 3D Visual Graph Section */}
      <WireframeWrapper backdrop={backdrop}>{icon}</WireframeWrapper>

      {/* Feature Title */}
      <h3 className="text-lg md:text-xl text-white text-center font-medium mb-3 tracking-tight font-sans transition-colors duration-300 group-hover:text-orange-500">
        {title}
      </h3>

      {/* Feature Description Paragraph */}
      <p className="font-mono text-zinc-400 text-xs md:text-[12.5px] leading-relaxed select-text mt-1 text-center">
        {description}
      </p>
    </div>
  );
};

/* Main FeatureCards Component Grid Render */
const FeatureCards = () => {
  const featuresList = [
    {
      title: 'Zero-Config Workspaces',
      description:
        'Bootstraps package structures and root configs dynamically in seconds.',
      icon: <FolderGit2 className="w-8 h-8" strokeWidth={1.5} />,
      backdrop: <WorkspaceConfigWireframe />,
    },
    {
      title: 'Orchestrator Engine',
      description:
        'Executes official generators directly to guarantee always up-to-date templates.',
      icon: <Cpu className="w-8 h-8" strokeWidth={1.5} />,
      backdrop: <ScaffoldingEngineWireframe />,
    },
    {
      title: 'PNPM Workspaces',
      description:
        'Unified dependency caching and fast script execution powered by pnpm.',
      icon: <Zap className="w-8 h-8" strokeWidth={1.5} />,
      backdrop: <TurborepoWireframe />,
    },
    {
      title: 'Automated Symlinking',
      description:
        'Wires cross-package dependencies with local symlinks and zero manual config.',
      icon: <Link2 className="w-8 h-8" strokeWidth={1.5} />,
      backdrop: <SymlinkWireframe />,
    },
    {
      title: 'Shared UI Components',
      description:
        'Pre-configured internal UI modules ready to import across all apps.',
      icon: <Palette className="w-8 h-8" strokeWidth={1.5} />,
      backdrop: <SharedUiWireframe />,
    },
    {
      title: 'Full Config Control',
      description:
        'Install only what you need with full control over tools and configs.',
      icon: <Database className="w-8 h-8" strokeWidth={1.5} />,
      backdrop: <DatabaseWireframe />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto ">
      {featuresList.map((feature, idx) => (
        <FeatureCard
          key={idx}
          title={feature.title}
          description={feature.description}
          icon={feature.icon}
          backdrop={feature.backdrop}
        />
      ))}
    </div>
  );
};

export default FeatureCards;
