/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AlignLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TocItem {
  id: string;
  label: string;
}

interface DocsTableOfContentsProps {
  items: TocItem[];
  activeId?: string;
  onItemClick?: (id: string) => void;
  className?: string;
}

export const DocsTableOfContents = ({
  items,
  activeId: controlledActiveId,
  onItemClick,
  className,
}: DocsTableOfContentsProps) => {
  const [activeId, setActiveId] = useState<string>(
    controlledActiveId || items[0]?.id || '',
  );
  const isClickScrolling = useRef(false);

  // Sync with controlled prop if passed
  useEffect(() => {
    if (controlledActiveId) {
      setActiveId(controlledActiveId);
    }
  }, [controlledActiveId]);

  // Reset when items array changes (page navigation)
  useEffect(() => {
    if (items.length > 0 && !items.some((i) => i.id === activeId)) {
      setActiveId(items[0]?.id || '');
    }
  }, [items, activeId]);

  // Dynamic Scroll-Spy: updates active indicator on scroll
  useEffect(() => {
    if (!items || items.length === 0) return;

    const handleScroll = () => {
      if (isClickScrolling.current) return;

      // Bottom of page check: activate the last section
      const isAtBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 70;

      if (isAtBottom) {
        const lastItem = items[items.length - 1];
        if (lastItem) {
          setActiveId(lastItem.id);
          onItemClick?.(lastItem.id);
          return;
        }
      }

      // Find section currently in view based on scroll position
      let currentSectionId = items[0]?.id || '';

      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Trigger when the section top has scrolled near the top navbar (130px)
          if (rect.top <= 130) {
            currentSectionId = item.id;
          }
        }
      }

      setActiveId(currentSectionId);
      onItemClick?.(currentSectionId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on load to detect starting position
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [items, onItemClick]);

  const handleLinkClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setActiveId(id);
    onItemClick?.(id);

    const el = document.getElementById(id);
    if (el) {
      isClickScrolling.current = true;
      const headerOffset = 70;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });

      // Re-enable scroll spy after smooth scroll animation completes
      setTimeout(() => {
        isClickScrolling.current = false;
      }, 700);
    }
  };

  return (
    <div
      className={cn(
        'w-60 shrink-0 p-6 select-none sticky top-24 self-start hidden xl:block',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 text-xs font-mono text-zinc-400">
        <AlignLeft className="w-3.5 h-3.5 text-zinc-500" />
        <span className="font-medium tracking-wide">On this page</span>
      </div>

      {/* Links with active indicator line */}
      <div className="flex flex-col border-l border-zinc-900 ml-1">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleLinkClick(e, item.id)}
              className={cn(
                'relative text-xs py-1.5 pl-3 transition-colors duration-200 block truncate',
                isActive
                  ? 'text-white font-medium border-l-2 border-orange-500 -ml-px'
                  : 'text-zinc-500 hover:text-zinc-300',
              )}
            >
              {item.label}
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default DocsTableOfContents;
