import Docs from '@/modules/Docs/Docs';
import { getDocMeta } from '@/modules/Docs/docsMeta';
import { notFound, redirect } from 'next/navigation';

const VALID_SLUGS = [
  'introduction',
  'comparison',
  'installation',
  'basic-usage',
  'nextjs',
  'vite',
  'hono-server',
  'express-server',
  'server',
  'shared-ui',
  'database',
  'authentication',
  'environment',
  'ai-skills',
  'workspace',
  'deployment',
  'trpc',
  'orpc',
];

export function generateStaticParams() {
  return VALID_SLUGS.map((slug) => ({ slug }));
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  if (!VALID_SLUGS.includes(slug)) {
    return { title: 'Not Found | Morax Docs' };
  }
  const meta = getDocMeta(slug);
  return {
    title: `${meta.title} | Morax Documentation`,
    description: meta.subtitle,
  };
}

export default async function DocSlugPage({ params }: PageProps) {
  const { slug } = await params;

  if (slug === 'server') {
    redirect('/docs/hono-server');
  }

  if (!VALID_SLUGS.includes(slug)) {
    notFound();
  }

  return <Docs slug={slug} />;
}
