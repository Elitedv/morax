import type { Metadata } from 'next';
import { Inter, Fira_Code } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const fira_code = Fira_Code({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-fira-code',
});

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
      className={cn(
        'h-full',
        'antialiased',
        inter.variable,
        fira_code.variable,
      )}
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
