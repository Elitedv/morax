'use client';

import React, { useState } from 'react';
import BackgroundLines from '@/Shared/BackgroundLines/BackgroundLines';
import { Copy, Check } from 'lucide-react';
import Section from '@/Shared/Seaction/Section';

const Herosection = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText('npx morax init');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy command:', err);
    }
  };

  return (
    <Section>
      <div className="min-h-[500px] flex flex-col justify-center py-10">
        <div className="text-3xl md:text-5xl lg:text-6xl lg:leading-18">
          <h1 className="text-white">The Fastest Way to Start a</h1>
          <h2 className="text-white">
            Monorepo
            <span className="text-orange-500 ml-4 font-semibold">
              PNPM Workspaces
            </span>
          </h2>
        </div>

        {/* CLI Download Btn */}
        <div className="mt-10 w-full max-w-xs font-fira-code">
          <div
            onClick={handleCopy}
            className="flex items-center justify-between px-6 py-4 bg-zinc-900/60 hover:bg-zinc-950 border border-white/8 hover:border-white/15 font-light text-[14px] text-zinc-300 cursor-pointer transition-all duration-300 select-none group w-full shadow-lg"
          >
            <div className="flex items-center gap-3">
              <span className="text-orange-500 font-bold select-none tracking-tight flex items-center">
                &gt;<span className="animate-pulse">_</span>
              </span>
              <span className="text-zinc-100 tracking-wide">
                npm create morax@latest
              </span>
            </div>
            <div>
              {copied ? (
                <Check className="h-4.5 w-4.5 text-emerald-400" />
              ) : (
                <Copy className="h-4.5 w-4.5 text-zinc-500 group-hover:text-zinc-300 transition-colors duration-200" />
              )}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Herosection;
