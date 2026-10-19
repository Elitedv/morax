'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { ClaudeLogo, GrokLogo } from '@/Shared/AiLogos';

interface OpenInAiDropdownProps {
  title: string;
  markdown: string;
  slug?: string;
}

interface AiOption {
  id: 'claude' | 'grok';
  name: string;
  icon: React.ReactNode;
  getUrl: (prompt: string) => string;
}

const AI_OPTIONS: AiOption[] = [
  {
    id: 'claude',
    name: 'Claude',
    icon: <ClaudeLogo className="w-3.5 h-3.5 shrink-0 text-amber-500" />,
    getUrl: (prompt) => `https://claude.ai/new?q=${encodeURIComponent(prompt)}`,
  },
  {
    id: 'grok',
    name: 'Grok',
    icon: <GrokLogo className="w-3.5 h-3.5 shrink-0 text-zinc-200" />,
    getUrl: (prompt) =>
      `https://x.com/i/grok?text=${encodeURIComponent(prompt)}`,
  },
];

export const OpenInAiDropdown = ({
  title,
  markdown,
  slug,
}: OpenInAiDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCopied, setActiveCopied] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const docUrl = slug
    ? `https://morax.elitedev.space/docs/${slug}`
    : 'https://morax.elitedev.space/docs';
  const siteUrl = 'https://morax.elitedev.space/';

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleOpenAi = async (option: AiOption) => {
    const prompt = `I am reading the official documentation for Morax (The Next-Gen PNPM Workspace & Monorepo Scaffolder CLI).\n\nDocumentation Page: "${title}"\nPage URL: ${docUrl}\nWebsite: ${siteUrl}\n\nDocumentation Content:\n${markdown}\n\nPlease help me understand this and how to use it in Morax. You can reference or web-search ${docUrl} or ${siteUrl} for additional details.`;

    // Copy prompt to clipboard
    try {
      await navigator.clipboard.writeText(prompt);
      setActiveCopied(option.id);
      setTimeout(() => setActiveCopied(null), 1500);
    } catch {
      // ignore clipboard error
    }

    const url = option.getUrl(prompt);
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button (rounded-none) */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-zinc-300 hover:text-white bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer rounded-none select-none"
      >
        <span>Open in</span>
        <ChevronDown
          className={`w-3 h-3 text-zinc-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-white' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu (rounded-none) */}
      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-36 rounded-none bg-[#0c0c0c] border border-zinc-800 shadow-2xl shadow-black/80 p-1 z-50 animate-in fade-in zoom-in-95 duration-100 font-mono">
          <div className="px-2 py-1 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
            Open in AI
          </div>
          {AI_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => handleOpenAi(option)}
              className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-zinc-300 hover:text-white hover:bg-zinc-900/80 rounded-none transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                {option.icon}
                <span className="font-medium">{option.name}</span>
              </div>
              {activeCopied === option.id ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : null}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default OpenInAiDropdown;
