import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Installation | Morax Documentation',
  description:
    'Learn how to install and use Morax to scaffold high-performance PNPM Workspaces monorepos.',
};

export default function DocsPage() {
  redirect('/docs/installation');
}
