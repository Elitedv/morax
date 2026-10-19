export interface DocsNavItem {
  id: string;
  title: string;
  href?: string;
  icon:
    | 'book'
    | 'comparison'
    | 'download'
    | 'sliders'
    | 'globe'
    | 'layers'
    | 'server'
    | 'palette'
    | 'database'
    | 'shield'
    | 'key'
    | 'bot'
    | 'terminal'
    | 'container';
  badge?: string;
  children?: DocsNavItem[];
}

export interface DocsNavSection {
  title: string;
  items: DocsNavItem[];
}

export const DOCS_NAV_CONFIG: DocsNavSection[] = [
  {
    title: 'Get Started',
    items: [
      {
        id: 'introduction',
        title: 'Introduction',
        href: '/docs/introduction',
        icon: 'book',
      },
      {
        id: 'comparison',
        title: 'Comparison',
        href: '/docs/comparison',
        icon: 'comparison',
      },
      {
        id: 'installation',
        title: 'Installation',
        href: '/docs/installation',
        icon: 'download',
      },
      {
        id: 'basic-usage',
        title: 'Basic Usage',
        href: '/docs/basic-usage',
        icon: 'sliders',
      },
    ],
  },
  {
    title: 'Applications',
    items: [
      { id: 'nextjs', title: 'Next.js', href: '/docs/nextjs', icon: 'globe' },
      { id: 'vite', title: 'React + Vite', href: '/docs/vite', icon: 'layers' },
      {
        id: 'server',
        title: 'API Server',
        icon: 'server',
        children: [
          {
            id: 'hono-server',
            title: 'Hono Server',
            href: '/docs/hono-server',
            icon: 'server',
          },
          {
            id: 'express-server',
            title: 'Express Server',
            href: '/docs/express-server',
            icon: 'server',
          },
        ],
      },
      {
        id: 'api-layer',
        title: 'API Layer',
        icon: 'layers',
        children: [
          {
            id: 'trpc',
            title: 'tRPC',
            href: '/docs/trpc',
            icon: 'terminal',
            badge: 'COMING SOON',
          },
          {
            id: 'orpc',
            title: 'oRPC',
            href: '/docs/orpc',
            icon: 'terminal',
            badge: 'COMING SOON',
          },
        ],
      },
    ],
  },
  {
    title: 'Packages',
    items: [
      {
        id: 'shared-ui',
        title: 'Shared UI',
        href: '/docs/shared-ui',
        icon: 'palette',
        badge: 'COMING SOON',
      },
      {
        id: 'database',
        title: 'Database (Drizzle)',
        href: '/docs/database',
        icon: 'database',
      },
      {
        id: 'authentication',
        title: 'Authentication',
        href: '/docs/authentication',
        icon: 'shield',
      },
      {
        id: 'environment',
        title: 'Environment',
        href: '/docs/environment',
        icon: 'key',
      },
    ],
  },
  {
    title: 'Workflow & DevOps',
    items: [
      {
        id: 'workspace',
        title: 'Workspace & Filtering',
        href: '/docs/workspace',
        icon: 'terminal',
      },
      {
        id: 'deployment',
        title: 'Docker & Deployment',
        href: '/docs/deployment',
        icon: 'container',
      },
    ],
  },
  {
    title: 'AI Agents',
    items: [
      {
        id: 'ai-skills',
        title: 'Skills & Rules',
        href: '/docs/ai-skills',
        icon: 'bot',
        badge: 'NEW',
      },
    ],
  },
];
