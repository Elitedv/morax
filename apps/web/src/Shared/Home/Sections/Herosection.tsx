'use client';

import React, { useState } from 'react';
import BackgroundLines from '@/Shared/BackgroundLines/BackgroundLines';
import { Copy, Check } from 'lucide-react';

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
    <BackgroundLines>
      <div className="min-h-[500px] flex flex-col justify-center py-10">
        <h1 className="text-6xl text-white leading-18">
          The Ultimate Toolkit for
        </h1>
        <h2 className="text-6xl text-white leading-18">
          Monorepo
          <span className="text-orange-500 ml-4 font-semibold">
            PNPM Workspaces
          </span>
        </h2>
        {/* <p className="text-zinc-300 font-light text-lg mt-4 max-w-4xl leading-relaxed">
                    Morax <span className="text-orange-500" >accelerate</span> your development cycle. <span className="text-orange-500" >Initilalize</span> production-ready, type-safe, and highly optimized multi-package workspace structures with a single command. <span className="text-orange-500" >Ultimate Toolkit for Monorepo PNPM Workspaces</span>
                </p> */}

        {/* CLI Download Btn */}
        <div className="mt-10 w-full max-w-xs">
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
    </BackgroundLines>
  );
};

export default Herosection;
