import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Morax',
  description: 'Morax Cli a pnpm Workspaces initilizer tool',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn('h-full', 'antialiased', 'font-inter', inter.variable)}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-black"
      >
        {children}
      </body>
    </html>
  );
}
