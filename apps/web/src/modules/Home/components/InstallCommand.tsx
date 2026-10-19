/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type PackageManager = 'npm' | 'pnpm' | 'bun';

interface PackageManagerOption {
  id: PackageManager;
  label: string;
  command: string;
  icon: string;
}

const PACKAGE_MANAGERS: PackageManagerOption[] = [
  {
    id: 'npm',
    label: 'npm',
    command: 'npm create morax@latest',
    icon: 'https://aset-s3.elitecoder.tech/user_3IAXHlzxrYxIoh5F572W5czSE7h/3fb7af5e-f37a-4abe-8d67-de25020932ad/771d193f-6720-4c5f-a427-d150329de1f9-npm-dark.png',
  },
  {
    id: 'pnpm',
    label: 'pnpm',
    command: 'pnpm create morax@latest',
    icon: 'https://aset-s3.elitecoder.tech/user_3IAXHlzxrYxIoh5F572W5czSE7h/3fb7af5e-f37a-4abe-8d67-de25020932ad/b820f261-fb89-4e1e-9ff4-3da6981ab2fc-pnpm-dark.png',
  },
  {
    id: 'bun',
    label: 'bun',
    command: 'bun create morax@latest',
    icon: 'https://aset-s3.elitecoder.tech/user_3IAXHlzxrYxIoh5F572W5czSE7h/3fb7af5e-f37a-4abe-8d67-de25020932ad/0fc87296-a7f9-4cde-91dd-49eee1946f8e-bun-dark.png',
  },
];

interface InstallCommandProps {
  className?: string;
  showTabs?: boolean;
  hideTabs?: boolean;
  defaultManager?: PackageManager;
}

const InstallCommand = ({
  className,
  showTabs = false,
  hideTabs,
  defaultManager = 'bun',
}: InstallCommandProps) => {
  const [selectedPm, setSelectedPm] = useState<PackageManager>(defaultManager);
  const [copied, setCopied] = useState(false);

  const displayTabs = hideTabs !== undefined ? !hideTabs : showTabs;

  const activeManager =
    PACKAGE_MANAGERS.find((pm) => pm.id === selectedPm) || PACKAGE_MANAGERS[0];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeManager.command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy command:', err);
    }
  };

  return (
    <div
      className={cn(
        'w-full max-w-sm sm:max-w-md font-fira-code flex flex-col',
        className,
      )}
    >
      {/* Top Tabs Box (Attached flush to the right of the bottom box, zero gap) */}
      {displayTabs && (
        <div className="flex justify-end">
          <div className="flex items-center border border-b-0 border-white/10 bg-zinc-950 divide-x divide-white/10 select-none">
            {PACKAGE_MANAGERS.map((pm) => {
              const isActive = selectedPm === pm.id;
              return (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => setSelectedPm(pm.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono transition-all duration-200 cursor-pointer select-none',
                    isActive
                      ? 'text-orange-500 bg-zinc-900 font-medium'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40',
                  )}
                >
                  <img
                    src={pm.icon}
                    alt={pm.label}
                    className="w-3.5 h-3.5 object-contain"
                  />
                  <span>{pm.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom CLI Command Box */}
      <div
        onClick={handleCopy}
        className="flex items-center justify-between px-6 py-4 bg-zinc-900/60 hover:bg-zinc-950 border border-white/10 font-light text-[14px] text-zinc-300 cursor-pointer transition-all duration-300 select-none group w-full shadow-lg"
      >
        <div className="flex items-center gap-3">
          <span className="text-orange-500 font-bold select-none tracking-tight flex items-center">
            &gt;<span className="animate-pulse">_</span>
          </span>
          <span className="text-zinc-100 tracking-wide font-mono">
            {activeManager.command}
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
  );
};

export default InstallCommand;
