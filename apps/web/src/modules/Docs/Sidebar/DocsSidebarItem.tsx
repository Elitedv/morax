/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  Columns2,
  Download,
  SlidersHorizontal,
  Globe,
  Layers,
  Server,
  Palette,
  Database,
  ShieldCheck,
  KeyRound,
  Bot,
  Terminal,
  Container,
  ChevronDown,
} from 'lucide-react';
import { DocsNavItem } from './docsNavConfig';

interface DocsSidebarItemProps {
  item: DocsNavItem;
  isActive: boolean;
  currentSectionId?: string;
  onSelect?: () => void;
  isNested?: boolean;
}

const renderIcon = (type?: string) => {
  const iconProps = { className: 'w-4 h-4 shrink-0' };
  switch (type) {
    case 'book':
      return <BookOpen {...iconProps} />;
    case 'comparison':
      return <Columns2 {...iconProps} />;
    case 'download':
      return <Download {...iconProps} />;
    case 'sliders':
      return <SlidersHorizontal {...iconProps} />;
    case 'globe':
      return <Globe {...iconProps} />;
    case 'layers':
      return <Layers {...iconProps} />;
    case 'server':
      return <Server {...iconProps} />;
    case 'palette':
      return <Palette {...iconProps} />;
    case 'database':
      return <Database {...iconProps} />;
    case 'shield':
      return <ShieldCheck {...iconProps} />;
    case 'key':
      return <KeyRound {...iconProps} />;
    case 'bot':
      return <Bot {...iconProps} />;
    case 'terminal':
      return <Terminal {...iconProps} />;
    case 'container':
      return <Container {...iconProps} />;
    default:
      return <BookOpen {...iconProps} />;
  }
};

export const DocsSidebarItem = ({
  item,
  isActive,
  currentSectionId,
  onSelect,
  isNested = false,
}: DocsSidebarItemProps) => {
  const hasChildren = Boolean(item.children && item.children.length > 0);
  const hasActiveChild = Boolean(
    item.children?.some(
      (child) =>
        child.id === currentSectionId ||
        child.children?.some((sub) => sub.id === currentSectionId),
    ),
  );

  const [isOpen, setIsOpen] = useState(hasActiveChild || false);

  useEffect(() => {
    if (hasActiveChild) {
      setIsOpen(true);
    }
  }, [hasActiveChild]);

  if (hasChildren) {
    return (
      <div className="flex flex-col">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={cn(
            'group flex items-center justify-between px-3 py-2 text-[13px] font-sans transition-all duration-150 select-none rounded-none cursor-pointer w-full text-left',
            hasActiveChild
              ? 'text-white font-medium bg-[#151515]'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40',
          )}
        >
          <div className="flex items-center gap-3 truncate min-w-0">
            <span
              className={cn(
                'transition-colors duration-150',
                hasActiveChild
                  ? 'text-white'
                  : 'text-zinc-500 group-hover:text-zinc-300',
              )}
            >
              {renderIcon(item.icon)}
            </span>
            <span className="truncate">{item.title}</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            {item.badge && (
              <span className="text-[9px] uppercase font-mono font-bold px-1.5 py-0.5 bg-orange-500 text-white tracking-wider">
                {item.badge}
              </span>
            )}
            <ChevronDown
              className={cn(
                'w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 group-hover:text-zinc-300',
                !isOpen && '-rotate-90',
              )}
            />
          </div>
        </button>

        {isOpen && item.children && (
          <div className="ml-5 pl-2.5 border-l border-zinc-800/80 flex flex-col gap-0.5 my-1">
            {item.children.map((child) => (
              <DocsSidebarItem
                key={child.id}
                item={child}
                isActive={currentSectionId === child.id}
                currentSectionId={currentSectionId}
                onSelect={onSelect}
                isNested
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  const href = item.href || '#';

  return (
    <Link
      href={href}
      onClick={onSelect}
      className={cn(
        'group flex items-center gap-3 font-sans transition-all duration-150 select-none rounded-none',
        isNested ? 'px-2.5 py-1.5 text-[12.5px]' : 'px-3 py-2 text-[13px]',
        isActive
          ? 'bg-[#151515] text-white font-medium'
          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40',
      )}
    >
      <span
        className={cn(
          'transition-colors duration-150',
          isActive ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300',
        )}
      >
        {renderIcon(item.icon)}
      </span>
      <span className="truncate">{item.title}</span>
      {item.badge && (
        <span className="ml-auto text-[9px] uppercase font-mono font-bold px-1.5 py-0.5 bg-orange-500 text-white tracking-wider shrink-0">
          {item.badge}
        </span>
      )}
    </Link>
  );
};

export default DocsSidebarItem;
