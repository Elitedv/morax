import type { Metadata } from 'next';
import { Inter, Fira_Code } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import FontChanger, { FontInitializer } from '@/Shared/FontChanger/FontChanger';
import { Lexend } from 'next/font/google';
import SmoothScroll from '@/Shared/SmoothScroll/SmoothScroll';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const lexend = Lexend({ subsets: ['latin'], variable: '--font-lexend' });

const fira_code = Fira_Code({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-fira-code',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://morax.elitedev.space'),
  title: {
    default: 'Morax',
    template: '%s | Morax',
  },
  description:
    'A highly polished, interactive CLI that instantly bootstraps modern, high-performance pnpm workspaces. Programmatically configure and link Next.js frontends, modular Express APIs, ESLint Flat configs, Prettier formatter, and Husky hooks concurrently.',
  keywords: [
    'pnpm workspaces',
    'monorepo orchestrator',
    'create-morax',
    'next.js scaffolding',
    'vite react template',
    'express ts api',
    'typescript monorepo',
    'eslint flat config',
    'prettier linter',
    'husky git hooks',
    'developer tooling',
    'scaffolder',
  ],
  authors: [{ name: 'AshutoshDM' }],
  creator: 'AshutoshDM',
  icons: {
    icon: [
      { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon/favicon.svg',
    apple: [
      {
        url: '/favicon/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
  manifest: '/favicon/site.webmanifest',
  alternates: {
    canonical: 'https://morax.elitedev.space',
  },
  openGraph: {
    title: 'Morax — Next-Gen pnpm Workspace & Monorepo Orchestrator',
    description:
      'Instantly bootstrap and link custom, high-performance pnpm workspaces. Configure framework frontends, typescript backend APIs, linters, and hooks concurrently.',
    url: 'https://morax.elitedev.space',
    siteName: 'Morax',
    images: [
      {
        url: '/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Morax — The Next-Generation Workspace Scaffolder',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Morax — Next-Gen pnpm Workspace Monorepo Orchestrator',
    description:
      'Instantly bootstrap and link custom, high-performance pnpm workspaces. Configure framework frontends, typescript backend APIs, linters, and hooks concurrently.',
    images: ['/og-image.webp'],
    creator: '@AshutoshDM_1',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        'h-full',
        'antialiased',
        inter.variable,
        fira_code.variable,
        lexend.variable,
      )}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-black"
      >
        {process.env.NODE_ENV === 'development' && (
          <>
            <FontInitializer />
          </>
        )}
        <SmoothScroll>{children}</SmoothScroll>
        {process.env.NODE_ENV === 'development' && (
          <>
            <FontChanger />
          </>
        )}
      </body>
    </html>
  );
}
