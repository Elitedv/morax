'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import IntroductionContent from '../Pages/IntroductionContent';
import ComparisonContent from '../Pages/ComparisonContent';
import InstallationContent from '../Pages/InstallationContent';
import BasicUsageContent from '../Pages/BasicUsageContent';
import NextjsContent from '../Pages/NextjsContent';
import ViteContent from '../Pages/ViteContent';
import ServerContent from '../Pages/ServerContent';
import HonoServerContent from '../Pages/HonoServerContent';
import ExpressServerContent from '../Pages/ExpressServerContent';
import SharedUiContent from '../Pages/SharedUiContent';
import DatabaseContent from '../Pages/DatabaseContent';
import AuthenticationContent from '../Pages/AuthenticationContent';
import EnvironmentContent from '../Pages/EnvironmentContent';
import AiSkillsContent from '../Pages/AiSkillsContent';
import WorkspaceContent from '../Pages/WorkspaceContent';
import DeploymentContent from '../Pages/DeploymentContent';
import TrpcContent from '../Pages/TrpcContent';
import OrpcContent from '../Pages/OrpcContent';
import OpenInAiDropdown from './OpenInAiDropdown';
import { ChatGptLogo } from '@/Shared/AiLogos';
import { getDocMeta } from '../docsMeta';

interface DocsContentProps {
  slug?: string;
}

export const DocsContent = ({ slug = 'installation' }: DocsContentProps) => {
  const [copiedMd, setCopiedMd] = useState(false);
  const meta = getDocMeta(slug);

  const handleCopyMd = async () => {
    try {
      await navigator.clipboard.writeText(meta.rawMarkdown);
      setCopiedMd(true);
      setTimeout(() => setCopiedMd(false), 2000);
    } catch (err) {
      console.error('Failed to copy markdown:', err);
    }
  };

  const docUrl = `https://morax.elitedev.space/docs/${slug}`;
  const siteUrl = 'https://morax.elitedev.space/';

  const handleOpenChatGpt = async () => {
    const prompt = `I am reading the official documentation for Morax (The Next-Gen PNPM Workspace & Monorepo Scaffolder CLI).\n\nDocumentation Page: "${meta.title}"\nPage URL: ${docUrl}\nWebsite: ${siteUrl}\n\nDocumentation Content:\n${meta.rawMarkdown}\n\nPlease help me understand this and how to use it in Morax. You can reference or web-search ${docUrl} or ${siteUrl} for additional details.`;
    try {
      await navigator.clipboard.writeText(prompt);
    } catch {
      // ignore
    }
    const url = `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const renderContent = () => {
    switch (slug) {
      case 'comparison':
        return <ComparisonContent />;
      case 'installation':
        return <InstallationContent />;
      case 'basic-usage':
        return <BasicUsageContent />;
      case 'nextjs':
        return <NextjsContent />;
      case 'vite':
        return <ViteContent />;
      case 'hono-server':
        return <HonoServerContent />;
      case 'express-server':
        return <ExpressServerContent />;
      case 'server':
        return <HonoServerContent />;
      case 'shared-ui':
        return <SharedUiContent />;
      case 'database':
        return <DatabaseContent />;
      case 'authentication':
        return <AuthenticationContent />;
      case 'environment':
        return <EnvironmentContent />;
      case 'ai-skills':
        return <AiSkillsContent />;
      case 'workspace':
        return <WorkspaceContent />;
      case 'deployment':
        return <DeploymentContent />;
      case 'trpc':
        return <TrpcContent />;
      case 'orpc':
        return <OrpcContent />;
      case 'introduction':
      default:
        return <IntroductionContent />;
    }
  };

  return (
    <article className="flex-1 max-w-4xl py-10 px-6 sm:px-10 lg:px-14 text-zinc-300 font-sans leading-relaxed">
      {/* Header Area matching Better Auth */}
      <div className="border-b border-zinc-900 pb-8 mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
          <h1 className="text-3xl sm:text-4xl text-white font-semibold tracking-tight">
            {meta.title}
          </h1>

          {/* Action buttons on top right */}
          <div className="flex items-center gap-2 select-none">
            <button
              type="button"
              onClick={handleCopyMd}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-zinc-300 hover:text-white bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer rounded-none"
            >
              {copiedMd ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Copy MD</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleOpenChatGpt}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-zinc-300 hover:text-white bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer rounded-none"
            >
              <ChatGptLogo className="w-3.5 h-3.5 text-emerald-400" />
              <span>ChatGPT</span>
            </button>

            <OpenInAiDropdown
              title={meta.title}
              markdown={meta.rawMarkdown}
              slug={slug}
            />
          </div>
        </div>

        <p className="text-zinc-500 text-sm sm:text-base font-mono">
          {meta.subtitle}
        </p>
      </div>

      {/* Main Page Specific Body */}
      {renderContent()}
    </article>
  );
};

export default DocsContent;
