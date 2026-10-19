'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface DocsSidebarSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const DocsSidebarSearch = ({
  value,
  onChange,
}: DocsSidebarSearchProps) => {
  return (
    <div className="relative w-full select-none font-fira-code">
      <div className="flex items-center justify-between px-3 py-2 bg-transparent hover:bg-zinc-900/30 border border-zinc-800/80 focus-within:border-zinc-700 transition-colors">
        <div className="flex items-center gap-2.5 w-full">
          <Search className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search"
            className="w-full bg-transparent text-xs text-zinc-200 placeholder-zinc-500 outline-none font-sans"
          />
        </div>
        <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-800">
          ⌘K
        </kbd>
      </div>
    </div>
  );
};

export default DocsSidebarSearch;
