import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: '404: Page Not Found | Morax',
  description: 'The requested page could not be found.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 font-fira-code selection:bg-orange-500 selection:text-white">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full flex flex-col gap-6 z-10">
        {/* Text & Actions */}
        <div className="flex flex-col items-center text-center gap-2">
          {/* Main 404 Title */}
          <h1 className="font-mono text-6xl sm:text-7xl font-black tracking-tight text-white select-none">
            4<span className="text-orange-500">0</span>4
          </h1>

          <h2 className="text-xl sm:text-2xl font-sans font-semibold text-white tracking-tight">
            Lost in the Workspace?
          </h2>

          <p className="text-zinc-400 font-sans text-xs sm:text-sm leading-relaxed max-w-sm mt-1">
            We couldn&apos;t find the page you were looking for. Return home or
            jump into our documentation.
          </p>

          <div className="flex items-center gap-3 mt-4 font-mono text-xs w-full sm:w-auto">
            <Link
              href="/"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-black font-semibold hover:bg-zinc-200 transition-colors"
            >
              <span>Return Home</span>
            </Link>

            <Link
              href="/docs"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Browse Docs</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
