/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useState, useEffect } from 'react';
import DocsHeader from './components/DocsHeader';
import DocsSidebar from './Sidebar/DocsSidebar';
import DocsContent from './components/DocsContent';
import { getDocMeta } from './docsMeta';
import DocsTableOfContents from './components/DocsTableOfContents';
import Footer from '@/Shared/Footer/Footer';
import { cn } from '@/lib/utils';

interface DocsProps {
  slug?: string;
}

export const Docs = ({ slug = 'installation' }: DocsProps) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const meta = getDocMeta(slug);
  const [activeToc, setActiveToc] = useState(meta.toc[0]?.id || '');

  useEffect(() => {
    setActiveToc(meta.toc[0]?.id || '');
  }, [slug, meta.toc]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Top Navbar matching Better Auth */}
      <DocsHeader
        isSidebarOpen={isMobileSidebarOpen}
        onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
      />

      {/* Main 3-Column Docs Layout */}
      <div className="flex-1 w-full flex relative">
        {/* Mobile Backdrop */}
        {isMobileSidebarOpen && (
          <div
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/80 z-30 md:hidden backdrop-blur-sm"
          />
        )}

        {/* Left Sidebar (Sticky under top navbar) */}
        <div
          className={cn(
            'fixed md:sticky top-14 z-40 md:z-10 h-[calc(100vh-3.5rem)] shrink-0 transition-transform duration-300 md:translate-x-0 bg-black',
            isMobileSidebarOpen
              ? 'translate-x-0'
              : '-translate-x-full md:translate-x-0',
          )}
        >
          <DocsSidebar
            currentSectionId={slug}
            onItemSelect={() => {
              setIsMobileSidebarOpen(false);
            }}
          />
        </div>

        {/* Center Main Documentation Body */}
        <main className="flex-1 min-w-0 flex justify-center py-6 px-4 md:px-12">
          <DocsContent slug={slug} />
        </main>

        {/* Right Table of Contents ("On this page") */}
        <DocsTableOfContents
          items={meta.toc}
          activeId={activeToc}
          onItemClick={(id) => setActiveToc(id)}
          className="top-14"
        />
      </div>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default Docs;
