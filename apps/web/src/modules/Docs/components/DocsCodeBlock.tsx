'use client';

import React, { useState, useMemo } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import Prism from 'prismjs';

// Language grammars
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';

interface DocsCodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  filename?: string;
  className?: string;
}

function highlightCode(code: string, language: string): string {
  const lang = (language || 'bash').toLowerCase().trim();
  let grammar = Prism.languages[lang];

  if (!grammar) {
    if (lang === 'tsx' || lang === 'jsx') {
      grammar = Prism.languages.tsx || Prism.languages.jsx;
    } else if (lang === 'ts' || lang === 'typescript') {
      grammar = Prism.languages.typescript || Prism.languages.javascript;
    } else if (lang === 'js' || lang === 'javascript') {
      grammar = Prism.languages.javascript;
    } else if (
      lang === 'sh' ||
      lang === 'shell' ||
      lang === 'bash' ||
      lang === 'terminal' ||
      lang === 'zsh'
    ) {
      grammar = Prism.languages.bash;
    } else if (lang === 'json') {
      grammar = Prism.languages.json;
    } else if (lang === 'yaml' || lang === 'yml') {
      grammar = Prism.languages.yaml;
    }
  }

  if (grammar) {
    try {
      return Prism.highlight(code, grammar, lang);
    } catch {
      // Fallback on Prism error
    }
  }

  // Safe fallback: HTML entity escape
  return code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export const DocsCodeBlock = ({
  code,
  language = 'bash',
  title,
  filename,
  className,
}: DocsCodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const highlightedHtml = useMemo(
    () => highlightCode(code, language),
    [code, language],
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  return (
    <div
      className={cn(
        'w-full bg-[#080808] border border-zinc-800/90 font-fira-code text-xs shadow-xl my-4 overflow-hidden rounded-none',
        className,
      )}
    >
      {/* Code Header Bar with Mac Terminal Traffic Light Colored Dots */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-950/90 border-b border-zinc-900 select-none">
        <div className="flex items-center gap-3">
          {/* Mac Terminal Colored Dots: Red, Yellow, Green */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] border border-[#e0443e]/50 inline-block shadow-sm" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] border border-[#dea123]/50 inline-block shadow-sm" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] border border-[#1aab29]/50 inline-block shadow-sm" />
          </div>

          <span className="font-mono text-zinc-400 text-xs font-medium">
            {title || filename || language}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-zinc-400 hover:text-white text-xs font-mono transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-zinc-500" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content with Syntax Highlighting */}
      <pre className="prism-code p-4 overflow-x-auto text-zinc-300 font-mono text-[13px] leading-relaxed select-text">
        <code dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
      </pre>
    </div>
  );
};

export default DocsCodeBlock;
