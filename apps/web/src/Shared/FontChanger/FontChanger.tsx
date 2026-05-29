'use client';

import React, { useState, useEffect, useRef, useTransition } from 'react';
import {
  Type,
  Search,
  Check,
  X,
  Globe,
  RefreshCw,
  ChevronDown,
  Sparkles,
  Laptop,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Premium categorized selection of Google Fonts
const GOOGLE_FONTS = [
  // Sans-serif
  {
    name: 'Inter',
    category: 'Sans-serif',
    description: 'Clean, neutral, and highly readable.',
  },
  {
    name: 'Plus Jakarta Sans',
    category: 'Sans-serif',
    description: 'Modern, geometric, and energetic.',
  },
  {
    name: 'Outfit',
    category: 'Sans-serif',
    description: 'Sleek, minimalist, and premium.',
  },
  {
    name: 'Space Grotesk',
    category: 'Sans-serif',
    description: 'Tech-forward, quirky, and bold.',
  },
  {
    name: 'Poppins',
    category: 'Sans-serif',
    description: 'Friendly, balanced, and elegant.',
  },
  {
    name: 'Montserrat',
    category: 'Sans-serif',
    description: 'Classic geometric architecture.',
  },
  {
    name: 'Raleway',
    category: 'Sans-serif',
    description: 'Lightweight, modern, and stylized.',
  },
  {
    name: 'Lexend',
    category: 'Sans-serif',
    description: 'Designed for optimal reading performance.',
  },
  {
    name: 'DM Sans',
    category: 'Sans-serif',
    description: 'Low-contrast, highly functional.',
  },

  // Serif
  {
    name: 'Playfair Display',
    category: 'Serif',
    description: 'Classic elegance and high contrast.',
  },
  {
    name: 'Lora',
    category: 'Serif',
    description: 'Brilliant brush-like, literary style.',
  },
  {
    name: 'Merriweather',
    category: 'Serif',
    description: 'High readability, warm, and sturdy.',
  },
  {
    name: 'Cinzel',
    category: 'Serif',
    description: 'Roman-inscribed classical structure.',
  },
  {
    name: 'Instrument Serif',
    category: 'Serif',
    description: 'Slim, expressive, and high-fashion.',
  },
  {
    name: 'EB Garamond',
    category: 'Serif',
    description: 'Humanist, legendary renaissance shape.',
  },
  {
    name: 'Cormorant Garamond',
    category: 'Serif',
    description: 'Prestigious, fine-serifed, and luxurious.',
  },

  // Monospace
  {
    name: 'Fira Code',
    category: 'Monospace',
    description: 'Tech-standard with elegant ligatures.',
  },
  {
    name: 'JetBrains Mono',
    category: 'Monospace',
    description: 'Crafted specifically for developers.',
  },
  {
    name: 'Space Mono',
    category: 'Monospace',
    description: 'Geometric, retro-futuristic vibes.',
  },
  {
    name: 'Courier Prime',
    category: 'Monospace',
    description: 'Classic typewriter style refined.',
  },
  {
    name: 'Source Code Pro',
    category: 'Monospace',
    description: 'Clean, professional coding design.',
  },

  // Creative & Display
  {
    name: 'Syne',
    category: 'Display',
    description: 'Artistic, highly conceptual, and wide.',
  },
  {
    name: 'Bungee',
    category: 'Display',
    description: 'Heavy, blocky, arcade-style power.',
  },
  {
    name: 'Pacifico',
    category: 'Display',
    description: 'Beautifully flowing hand-drawn script.',
  },
  {
    name: 'Lobster',
    category: 'Display',
    description: 'Vintage, bold, and energetic cursive.',
  },
  {
    name: 'Creepster',
    category: 'Display',
    description: 'Gothic, horror, and spooky display.',
  },
  {
    name: 'Cabin Sketch',
    category: 'Display',
    description: 'Hand-drawn, scribbled notebook feel.',
  },
  {
    name: 'Playpen Sans',
    category: 'Display',
    description: 'Playful, handwritten casual font.',
  },
  {
    name: 'Bebas Neue',
    category: 'Display',
    description: 'Tall, condensed, striking title-maker.',
  },
  {
    name: 'Cinzel Decorative',
    category: 'Display',
    description: 'Ultra-ornately styled classic serif.',
  },
];

const CATEGORIES = ['All', 'Sans-serif', 'Serif', 'Monospace', 'Display'];

// Helper to inject Google Font link dynamically
export const loadGoogleFont = (fontName: string) => {
  if (typeof window === 'undefined') return;
  const linkId = `dynamic-font-${fontName.replace(/ /g, '-').toLowerCase()}`;
  if (document.getElementById(linkId)) return;

  const url = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@400;500;600;700&display=swap`;
  const link = document.createElement('link');
  link.id = linkId;
  link.rel = 'stylesheet';
  link.href = url;
  document.head.appendChild(link);
};

// Helper to apply the selected font globally
export const applyGlobalFont = (fontName: string, isEnabled: boolean) => {
  if (typeof window === 'undefined') return;

  let styleTag = document.getElementById(
    'global-font-style',
  ) as HTMLStyleElement | null;

  if (!isEnabled) {
    if (styleTag) {
      styleTag.innerHTML = '';
    }
    document.documentElement.style.removeProperty('--font-global');
    return;
  }

  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = 'global-font-style';
    document.head.appendChild(styleTag);
  }

  // Force apply across the entire web-page elements using standard and high specificity selectors
  styleTag.innerHTML = `
    body, html, h1, h2, h3, h4, h5, h6, p, span, a, button, input, textarea, div, code, pre, label, section, footer, header {
      font-family: "${fontName}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
    }
  `;
  document.documentElement.style.setProperty('--font-global', `"${fontName}"`);
};

/**
 * FontInitializer: Silent loader component that reads from localStorage
 * and applies the preferred font immediately during client-side bootstrap
 */
export function FontInitializer() {
  useEffect(() => {
    try {
      const savedFont = localStorage.getItem('morax-selected-font');
      const isGlobal =
        localStorage.getItem('morax-global-font-enabled') === 'true';

      if (savedFont && isGlobal) {
        loadGoogleFont(savedFont);
        applyGlobalFont(savedFont, true);
      }
    } catch (e) {
      console.error('Failed to initialize dynamic font:', e);
    }
  }, []);

  return null;
}

export default function FontChanger() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFont, setSelectedFont] = useState('Inter');
  const [isGlobalEnabled, setIsGlobalEnabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [customText, setCustomText] = useState(
    'Morax CLI: Boostrap production-ready monorepos concurrently.',
  );
  const [isPending, startTransition] = useTransition();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Load configuration from localStorage on mount
  useEffect(() => {
    try {
      const savedFont = localStorage.getItem('morax-selected-font');
      const isGlobal =
        localStorage.getItem('morax-global-font-enabled') === 'true';

      if (savedFont) {
        setSelectedFont(savedFont);
        loadGoogleFont(savedFont);
      }
      setIsGlobalEnabled(isGlobal);
    } catch (e) {
      console.warn('LocalStorage is not accessible:', e);
    }
  }, []);

  // Sync click outside to close dropdown
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Load preview font dynamically when active preview font changes
  useEffect(() => {
    loadGoogleFont(selectedFont);
  }, [selectedFont]);

  // Filter Google Fonts based on search query and category tab
  const filteredFonts = GOOGLE_FONTS.filter((font) => {
    const matchesSearch = font.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === 'All' || font.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectFont = (fontName: string) => {
    setSelectedFont(fontName);
    setIsDropdownOpen(false);
  };

  const handleSave = () => {
    startTransition(() => {
      try {
        localStorage.setItem('morax-selected-font', selectedFont);
        localStorage.setItem(
          'morax-global-font-enabled',
          String(isGlobalEnabled),
        );
        applyGlobalFont(selectedFont, isGlobalEnabled);
        setIsOpen(false);
      } catch (e) {
        console.error('Failed to save font settings:', e);
      }
    });
  };

  const handleReset = () => {
    startTransition(() => {
      try {
        localStorage.removeItem('morax-selected-font');
        localStorage.removeItem('morax-global-font-enabled');
        setSelectedFont('Inter');
        setIsGlobalEnabled(false);
        applyGlobalFont('Inter', false);
        setIsOpen(false);
      } catch (e) {
        console.error('Failed to reset font settings:', e);
      }
    });
  };

  return (
    <>
      <style>{`
        @keyframes font-studio-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes font-studio-slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .font-studio-backdrop {
          animation: font-studio-fade-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .font-studio-modal {
          animation: font-studio-slide-up 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Floating Trigger Widget in bottom-right corner */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Customize Typography"
        className={cn(
          'fixed bottom-6 right-6 z-50 flex items-center justify-center gap-2',
          'h-12 px-4 rounded-full font-mono text-[11px] uppercase tracking-widest text-zinc-300',
          'bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/80 shadow-2xl',
          'hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]',
          'transition-all duration-300 active:scale-95 group select-none',
        )}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
        </span>
        <Type className="w-4 h-4 text-purple-400 group-hover:rotate-12 transition-transform duration-300" />
        <span>Typography Studio</span>
      </button>

      {/* Main Dialog Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md font-studio-backdrop">
          {/* Dialog Container */}
          <div
            ref={modalRef}
            className={cn(
              'w-full max-w-2xl bg-zinc-950/95 border border-zinc-800 rounded-2xl overflow-hidden',
              'shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col relative font-studio-modal',
            )}
          >
            {/* Ambient Background Glows */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-orange-950/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header section */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-900 relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-purple-950/50 border border-purple-900/50 rounded-lg">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-zinc-100 tracking-tight">
                    Typography Studio
                  </h2>
                  <p className="text-xs text-zinc-500 font-mono">
                    CUSTOMIZE GOOGLE FONTS REALTIME
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg border border-zinc-900 bg-zinc-900/20 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh] relative z-10">
              {/* Step 1: Select Font */}
              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                  <span>01 / Select Google Font</span>
                </label>

                {/* Dropdown Container */}
                <div ref={dropdownRef} className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={cn(
                      'w-full flex items-center justify-between px-4 py-3 rounded-xl',
                      'bg-zinc-900/40 border border-zinc-800 text-left font-sans text-sm',
                      'hover:border-zinc-700 hover:bg-zinc-900/60 transition-all',
                      'focus:outline-none focus:ring-1 focus:ring-purple-500/50',
                    )}
                  >
                    <div className="flex flex-col">
                      <span
                        className="font-semibold text-zinc-200"
                        style={{ fontFamily: `"${selectedFont}", sans-serif` }}
                      >
                        {selectedFont}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono mt-0.5">
                        {
                          GOOGLE_FONTS.find((f) => f.name === selectedFont)
                            ?.category
                        }{' '}
                        •{' '}
                        {
                          GOOGLE_FONTS.find((f) => f.name === selectedFont)
                            ?.description
                        }
                      </span>
                    </div>
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 text-zinc-500 transition-transform duration-200',
                        isDropdownOpen && 'rotate-180',
                      )}
                    />
                  </button>

                  {/* Dropdown Menu Portal */}
                  {isDropdownOpen && (
                    <div className="absolute top-[calc(100%+6px)] left-0 right-0 z-50 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[320px]">
                      {/* Search & Filter Header */}
                      <div className="p-3 border-b border-zinc-900 bg-zinc-900/10 space-y-2.5">
                        <div className="relative">
                          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-500" />
                          <input
                            type="text"
                            placeholder="Search among massive font pool..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800/80 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600 font-mono"
                          />
                        </div>

                        {/* Category Filter Pills */}
                        <div className="flex flex-wrap gap-1">
                          {CATEGORIES.map((cat) => (
                            <button
                              key={cat}
                              onClick={() => setActiveCategory(cat)}
                              className={cn(
                                'px-2 py-0.5 rounded text-[10px] font-mono tracking-tight uppercase transition-colors',
                                activeCategory === cat
                                  ? 'bg-purple-950 text-purple-400 border border-purple-900/50'
                                  : 'bg-zinc-900/40 text-zinc-500 hover:text-zinc-300 border border-transparent',
                              )}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Options List */}
                      <div className="overflow-y-auto flex-1 py-1">
                        {filteredFonts.length > 0 ? (
                          filteredFonts.map((font) => {
                            // Pre-initialize fonts on hover to make load instant
                            const handleHover = () => {
                              loadGoogleFont(font.name);
                            };

                            return (
                              <button
                                key={font.name}
                                onMouseEnter={handleHover}
                                onClick={() => handleSelectFont(font.name)}
                                className={cn(
                                  'w-full flex items-center justify-between px-4 py-2.5 text-left text-xs transition-colors',
                                  selectedFont === font.name
                                    ? 'bg-zinc-900 text-purple-400'
                                    : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200',
                                )}
                              >
                                <div className="flex flex-col">
                                  <span
                                    style={{
                                      fontFamily: `"${font.name}", sans-serif`,
                                    }}
                                    className="text-sm font-medium"
                                  >
                                    {font.name}
                                  </span>
                                  <span className="text-[9px] text-zinc-600 font-mono mt-0.5">
                                    {font.category} • {font.description}
                                  </span>
                                </div>
                                {selectedFont === font.name && (
                                  <Check className="w-3.5 h-3.5 text-purple-500" />
                                )}
                              </button>
                            );
                          })
                        ) : (
                          <div className="px-4 py-6 text-center text-zinc-600 font-mono text-[10px]">
                            NO FONTS MATCHED YOUR CRITERIA
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 2: Live Preview Block */}
              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">
                  <span>02 / Live Typography Preview</span>
                </label>

                {/* Elegant terminal-like preview board */}
                <div className="border border-zinc-900 rounded-xl bg-zinc-950 p-5 relative overflow-hidden flex flex-col gap-4">
                  <div className="absolute top-0 right-0 px-2 py-0.5 border-l border-b border-zinc-900 rounded-bl bg-zinc-900/10 font-mono text-[8px] text-zinc-600 tracking-widest uppercase select-none">
                    Preview Pane
                  </div>

                  {/* Sample content styled with the active preview font */}
                  <div
                    className="space-y-2.5 select-all"
                    style={{ fontFamily: `"${selectedFont}", sans-serif` }}
                  >
                    <h3 className="text-xl font-bold text-zinc-100 tracking-tight leading-tight">
                      Morax Workspace Orchestrator
                    </h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      {customText ||
                        'Type something below to check custom branding rendering.'}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-2 font-mono">
                      <span>$ npm create morax@latest</span>
                    </div>
                  </div>

                  {/* Interactive typed text block */}
                  <div className="mt-2 border-t border-zinc-900/60 pt-3.5">
                    <input
                      type="text"
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      placeholder="Type custom text to preview font weight & style..."
                      className="w-full bg-zinc-900/30 border border-zinc-900 rounded-lg px-3 py-2 text-xs text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-800 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Global Switch toggle */}
              <div className="p-4 border border-zinc-900 rounded-xl bg-zinc-900/10 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-zinc-300">
                    <Globe className="w-3.5 h-3.5 text-purple-400" />
                    <span>Force Apply Globally</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 max-w-[420px]">
                    Forcefully override the font configuration across all
                    headings, paragraphs, and components of the entire website.
                  </p>
                </div>

                {/* Cyberpunk styled toggle switch */}
                <button
                  role="switch"
                  aria-checked={isGlobalEnabled}
                  onClick={() => setIsGlobalEnabled(!isGlobalEnabled)}
                  className={cn(
                    'w-11 h-6 rounded-full p-0.5 transition-colors duration-300 outline-none select-none relative shrink-0',
                    isGlobalEnabled ? 'bg-purple-600' : 'bg-zinc-800',
                  )}
                >
                  <div
                    className={cn(
                      'w-5 h-5 rounded-full bg-zinc-100 shadow-md transition-transform duration-300 flex items-center justify-center',
                      isGlobalEnabled ? 'translate-x-5' : 'translate-x-0',
                    )}
                  >
                    {isGlobalEnabled && (
                      <Check className="w-3 h-3 text-purple-600" />
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Footer actions */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-900 bg-zinc-950/90 relative z-10">
              <button
                disabled={isPending}
                onClick={handleReset}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg',
                  'border border-zinc-850 bg-zinc-900/10 font-mono text-[10px] uppercase tracking-wider text-zinc-500',
                  'hover:border-zinc-800 hover:text-zinc-300 transition-colors duration-200 active:scale-95 disabled:opacity-50',
                )}
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset to Standard</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'px-4 py-1.5 rounded-lg border border-zinc-900 font-mono text-[10px] uppercase tracking-wider text-zinc-400',
                    'hover:bg-zinc-900/40 hover:text-zinc-200 transition-colors active:scale-95',
                  )}
                >
                  Cancel
                </button>
                <button
                  disabled={isPending}
                  onClick={handleSave}
                  className={cn(
                    'flex items-center gap-1.5 px-4.5 py-1.5 rounded-lg',
                    'bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500',
                    'text-zinc-100 border border-purple-500/20 shadow-lg font-mono text-[10px] uppercase tracking-wider',
                    'hover:shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all duration-300 active:scale-95 disabled:opacity-50',
                  )}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isPending ? 'Applying...' : 'Save & Apply'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
