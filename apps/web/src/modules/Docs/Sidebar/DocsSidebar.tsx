/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DOCS_NAV_CONFIG } from './docsNavConfig';
import DocsSidebarSearch from './DocsSidebarSearch';
import DocsSidebarItem from './DocsSidebarItem';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DocsSidebarProps {
  currentSectionId?: string;
  onItemSelect?: (id: string) => void;
  className?: string;
}

// Default state: Get Started and Applications are OPEN (false = not collapsed), all others COLLAPSED (true)
const DEFAULT_COLLAPSED_STATE: Record<string, boolean> = {
  'Get Started': false,
  Applications: false,
  Packages: false,
  'Workflow & DevOps': true,
  'AI Agents': true,
};

// In-memory state persistent across client-side page transitions
let memoryCollapsedState: Record<string, boolean> = {
  ...DEFAULT_COLLAPSED_STATE,
};

export const DocsSidebar = ({
  currentSectionId = 'installation',
  onItemSelect,
  className,
}: DocsSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>
  >(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem('morax_docs_sidebar_collapsed_v5');
        if (saved) {
          return { ...DEFAULT_COLLAPSED_STATE, ...JSON.parse(saved) };
        }
      } catch {
        // ignore
      }
    }
    return memoryCollapsedState;
  });

  // Auto-expand parent section if the currentSectionId is inside it
  useEffect(() => {
    const parentSection = DOCS_NAV_CONFIG.find((section) =>
      section.items.some(
        (item) =>
          item.id === currentSectionId ||
          item.children?.some((child) => child.id === currentSectionId),
      ),
    );
    if (parentSection) {
      setCollapsedSections((prev) => {
        if (prev[parentSection.title]) {
          const next = { ...prev, [parentSection.title]: false };
          memoryCollapsedState = next;
          return next;
        }
        return prev;
      });
    }
  }, [currentSectionId]);

  const toggleSection = (sectionTitle: string) => {
    setCollapsedSections((prev) => {
      const next = {
        ...prev,
        [sectionTitle]: !prev[sectionTitle],
      };
      memoryCollapsedState = next;
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem(
            'morax_docs_sidebar_collapsed',
            JSON.stringify(next),
          );
        } catch {
          // ignore
        }
      }
      return next;
    });
  };

  const filteredSections = DOCS_NAV_CONFIG.map((section) => ({
    ...section,
    items: section.items.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      const matchParent = item.title.toLowerCase().includes(q);
      const matchChild = item.children?.some((child) =>
        child.title.toLowerCase().includes(q),
      );
      return matchParent || matchChild;
    }),
  })).filter((section) => section.items.length > 0);

  return (
    <aside
      className={cn(
        'w-64 xl:w-72 border-r border-zinc-900 bg-black flex flex-col select-none h-full',
        className,
      )}
    >
      <ScrollArea className="h-full w-full">
        {/* Search & Navigation List */}
        <div className="p-4 flex flex-col gap-5">
          {/* Search Input with ⌘K */}
          <DocsSidebarSearch value={searchQuery} onChange={setSearchQuery} />

          {/* Section Groups */}
          <div className="flex flex-col gap-6">
            {filteredSections.map((section) => {
              // When searching, expand matching sections; otherwise use collapsed state
              const isCollapsed =
                searchQuery.trim().length > 0
                  ? false
                  : (collapsedSections[section.title] ??
                    DEFAULT_COLLAPSED_STATE[section.title] ??
                    false);

              return (
                <div key={section.title} className="flex flex-col">
                  {/* Collapsible Section Header */}
                  <button
                    type="button"
                    onClick={() => toggleSection(section.title)}
                    className="flex items-center justify-between py-1.5 text-xs font-semibold text-white hover:text-zinc-200 transition-colors cursor-pointer group select-none"
                  >
                    <div className="flex items-center gap-2">
                      <PlayCircle className="w-4 h-4 text-white fill-white/10 shrink-0" />
                      <span className="font-sans font-semibold text-[13.5px] tracking-tight">
                        {section.title}
                      </span>
                    </div>
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 text-zinc-500 transition-transform duration-200 group-hover:text-zinc-300',
                        isCollapsed && '-rotate-90',
                      )}
                    />
                  </button>

                  {/* Items in Section */}
                  {!isCollapsed && (
                    <div className="flex flex-col gap-0.5 mt-2">
                      {section.items.map((item) => (
                        <DocsSidebarItem
                          key={item.id}
                          item={item}
                          isActive={currentSectionId === item.id}
                          currentSectionId={currentSectionId}
                          onSelect={() => onItemSelect?.(item.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
};

export default DocsSidebar;
