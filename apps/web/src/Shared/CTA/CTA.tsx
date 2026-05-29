'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import Section from '../Seaction/Section';

const CTA = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('npm create morax@latest');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Section className={cn('w-full mt-8 mb-16 relative')}>
      <div
        style={{ backgroundColor: '#FF5A00' }}
        className={cn(
          'text-black p-8 md:p-14 flex flex-col gap-10 shadow-2xl rounded-none border-none relative overflow-hidden',
        )}
      >
        {/* Dynamic decorative backdrop lines */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-linear-to-l from-black/10 to-transparent pointer-events-none" />

        {/* CTA Top Badge */}
        <div
          className={cn(
            'flex items-center gap-2 font-mono text-[10px] font-bold text-black/70 uppercase tracking-widest select-none',
          )}
        >
          <span
            className={cn(
              'w-2 h-2 bg-black rounded-full animate-pulse shadow-[0_0_6px_rgba(0,0,0,0.3)]',
            )}
          />
          CLI
        </div>

        {/* Core Content Box */}
        <div className={cn('flex flex-col gap-4 max-w-2xl mt-4')}>
          <h2
            className={cn(
              'text-3xl md:text-5xl tracking-tight text-black leading-tight font-normal font-sans',
            )}
          >
            Build Monorepos Faster with Morax
          </h2>
          <p className={cn('font-mono text-xs md:text-lg text-black/80 mt-2')}>
            Zero manual workspace configurations. Fully automated setup
            included.
          </p>
        </div>

        {/* Action Button and Copy Command Row */}
        <div
          className={cn(
            'flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-4 w-full sm:w-auto',
          )}
        >
          {/* Main CTA button
                    <a
                        href="https://github.com/Elitedv/morax"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                            "inline-block bg-black hover:bg-zinc-900 active:bg-zinc-800 text-center",
                            "text-white font-mono text-[11px] px-6 py-3 uppercase tracking-widest",
                            "transition-colors duration-200 rounded-none shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-transparent whitespace-nowrap"
                        )}
                    >
                        Get started now
                    </a> */}

          {/* Copyable CLI Command div */}
          <div
            onClick={handleCopy}
            title="Click to copy command"
            className={cn(
              'flex items-center justify-between gap-6 bg-black text-white font-fira-code text-sm  px-4 py-3 cursor-pointer',
              'hover:text-white transition-all duration-200 border border-zinc-800/10 rounded-none w-full sm:w-auto select-none',
              copied ? 'border-orange-950/20 text-orange-500' : '',
            )}
          >
            <div className={cn('flex items-center gap-2')}>
              <span className={cn('text-zinc-600 font-bold')}>$</span>
              <span>npm create morax@latest</span>
            </div>

            {/* Copy / Copied Feedback Icon */}
            <div className={cn('shrink-0 ml-2')}>
              {copied ? (
                <div
                  className={cn(
                    'flex items-center gap-1.5 font-bold text-[10px] text-orange-500 uppercase tracking-wider scale-105 transition-all duration-200 animate-pulse',
                  )}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-3.5 h-3.5"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>copied!</span>
                </div>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3.5 h-3.5 opacity-60 hover:opacity-100 transition-opacity duration-200"
                >
                  <rect x="9" y="9" width="13" height="13" rx="0" ry="0" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default CTA;
