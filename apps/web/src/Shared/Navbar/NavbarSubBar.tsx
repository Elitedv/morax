import React from 'react';
import { cn } from '@/lib/utils';

interface NavbarSubBarProps {
  children?: React.ReactNode;
  className?: string;
  gridCols?: number;
}

export const NavbarSubBar = ({
  children,
  className,
  gridCols = 8,
}: NavbarSubBarProps) => {
  return (
    <div
      className={cn(
        'w-full border-t border-white/10 bg-black relative',
        className,
      )}
    >
      {/* Outer wrapper matching page bounds */}
      <div className="max-w-[1800px] mx-auto w-full relative">
        <div className="relative z-10 max-w-[1800px] mx-auto px-6 md:px-20 w-full grid grid-cols-2 md:grid-cols-8 text-[12px] font-mono tracking-tight text-zinc-400">
          {children}
        </div>
      </div>
    </div>
  );
};

interface NavbarSubBarItemProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'right';
  status?: boolean;
  colIndex?: number; // 1-indexed column position on desktop (1 to 8)
}

export const NavbarSubBarItem = ({
  children,
  className,
  align = 'left',
  status = false,
  colIndex = 1,
}: NavbarSubBarItemProps) => {
  // Map colIndex to specific Tailwind grid starting column classes
  const colStartClasses: Record<number, string> = {
    1: 'md:col-start-1',
    2: 'md:col-start-2',
    3: 'md:col-start-3',
    4: 'md:col-start-4',
    5: 'md:col-start-5',
    6: 'md:col-start-6',
    7: 'md:col-start-7',
    8: 'md:col-start-8',
  };

  const colStart = colStartClasses[colIndex] || 'md:col-start-1';

  return (
    <div
      className={cn(
        'py-3.5 flex items-center min-h-[44px] z-20',
        align === 'right'
          ? 'justify-end text-right'
          : 'justify-start text-left',
        colIndex === 1 && 'col-span-1',
        colIndex > 1 && `col-span-1 ${colStart}`,
        // Handle mobile grid alignment
        colIndex === 8 ? 'col-start-2' : 'col-start-1',
        className,
      )}
    >
      {status && (
        <span className="relative flex h-1.5 w-1.5 mr-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00c853] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00c853]"></span>
        </span>
      )}
      <span
        className={cn(
          status
            ? 'text-[#00c853] font-medium text-[13px] tracking-wide '
            : 'text-zinc-400 font-normal',
        )}
      >
        {children}
      </span>
    </div>
  );
};
