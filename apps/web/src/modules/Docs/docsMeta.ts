import { INTRODUCTION_TOC } from './Pages/IntroductionContent';
import { COMPARISON_TOC } from './Pages/ComparisonContent';
import { INSTALLATION_TOC } from './Pages/InstallationContent';
import { BASIC_USAGE_TOC } from './Pages/BasicUsageContent';
import { NEXTJS_TOC } from './Pages/NextjsContent';
import { VITE_TOC } from './Pages/ViteContent';
import { SERVER_TOC } from './Pages/ServerContent';
import { HONO_SERVER_TOC } from './Pages/HonoServerContent';
import { EXPRESS_SERVER_TOC } from './Pages/ExpressServerContent';
import { SHARED_UI_TOC } from './Pages/SharedUiContent';
import { DATABASE_TOC } from './Pages/DatabaseContent';
import { AUTH_TOC } from './Pages/AuthenticationContent';
import { ENV_TOC } from './Pages/EnvironmentContent';
import { AI_SKILLS_TOC } from './Pages/AiSkillsContent';
import { WORKSPACE_TOC } from './Pages/WorkspaceContent';
import { DEPLOYMENT_TOC } from './Pages/DeploymentContent';
import { TRPC_TOC } from './Pages/TrpcContent';
import { ORPC_TOC } from './Pages/OrpcContent';
import { TocItem } from './components/DocsTableOfContents';

export interface DocMetadata {
  title: string;
  subtitle: string;
  toc: TocItem[];
  rawMarkdown: string;
}

export const getDocMeta = (slug = 'introduction'): DocMetadata => {
  switch (slug) {
    case 'comparison':
      return {
        title: 'Comparison',
        subtitle:
          'Why Morax vs. Traditional Boilerplates, Turborepo, & Manual Setups.',
        toc: COMPARISON_TOC,
        rawMarkdown: `# Comparison\n\nHow Morax compares to static boilerplates, Turborepo, and standalone CLIs.`,
      };
    case 'installation':
      return {
        title: 'Installation',
        subtitle:
          'How to install and launch Morax across different package managers.',
        toc: INSTALLATION_TOC,
        rawMarkdown: `# Installation\n\nRun \`npm create morax@latest\` or \`pnpm create morax@latest\`.`,
      };
    case 'basic-usage':
      return {
        title: 'Basic Usage',
        subtitle:
          'Step-by-step walkthrough of creating and running your first Morax monorepo.',
        toc: BASIC_USAGE_TOC,
        rawMarkdown: `# Basic Usage\n\nLearn how to configure apps, shared packages, and run scripts with Morax.`,
      };
    case 'nextjs':
      return {
        title: 'Next.js Application',
        subtitle:
          'Next.js 15+ App Router configured with React 19, Tailwind CSS, and shared packages.',
        toc: NEXTJS_TOC,
        rawMarkdown: `# Next.js in Morax\n\nScaffolded with React 19, Tailwind CSS v4, and symlinked workspace packages.`,
      };
    case 'vite':
      return {
        title: 'React + Vite',
        subtitle:
          'Instant-boot single page application template powered by Vite and shared UI components.',
        toc: VITE_TOC,
        rawMarkdown: `# React + Vite in Morax\n\nUltra-fast single page application template consuming workspace UI components.`,
      };
    case 'hono-server':
      return {
        title: 'Hono API Server',
        subtitle:
          'Lightweight, ultrafast web-standards backend scaffolded with @hono/node-server and @repo/db.',
        toc: HONO_SERVER_TOC,
        rawMarkdown: `# Hono Server in Morax\n\nUltra-fast, lightweight web-standards API server using @hono/node-server and @repo/db.`,
      };
    case 'express-server':
      return {
        title: 'Express API Server',
        subtitle:
          'Battle-tested, flexible Node.js REST API server with standard middlewares and @repo/db integration.',
        toc: EXPRESS_SERVER_TOC,
        rawMarkdown: `# Express Server in Morax\n\nProduction-ready Express server scaffolded in apps/server with @repo/db and @repo/env.`,
      };
    case 'server':
      return {
        title: 'Hono API Server',
        subtitle:
          'Lightweight, ultrafast web-standards backend scaffolded with @hono/node-server and @repo/db.',
        toc: HONO_SERVER_TOC,
        rawMarkdown: `# Hono Server in Morax\n\nUltra-fast, lightweight web-standards API server using @hono/node-server and @repo/db.`,
      };
    case 'shared-ui':
      return {
        title: 'Shared UI Package',
        subtitle:
          'Unified design system and Radix UI primitives shared across Next.js and Vite.',
        toc: SHARED_UI_TOC,
        rawMarkdown: `# Shared UI (@repo/ui)\n\nZero-build component sharing between frontend applications.`,
      };
    case 'database':
      return {
        title: 'Database (Drizzle)',
        subtitle:
          'Centralized Drizzle ORM schemas, pooled database clients, and migration tooling.',
        toc: DATABASE_TOC,
        rawMarkdown: `# Database (@repo/db)\n\nDrizzle ORM models and pooled clients shared across applications.`,
      };
    case 'authentication':
      return {
        title: 'Authentication',
        subtitle:
          'End-to-end user authentication, session cookies, and route handlers with Better Auth.',
        toc: AUTH_TOC,
        rawMarkdown: `# Authentication (@repo/auth)\n\nComplete auth flows powered by Better Auth.`,
      };
    case 'environment':
      return {
        title: 'Environment',
        subtitle:
          'Type-safe Zod runtime environment variable validation across the monorepo.',
        toc: ENV_TOC,
        rawMarkdown: `# Environment (@repo/env)\n\nStrict type-safe environment validation.`,
      };
    case 'ai-skills':
      return {
        title: 'AI Agent Skills & Rules',
        subtitle:
          'Automated skills.sh integration and .agents/rules discovery for AI-assisted coding.',
        toc: AI_SKILLS_TOC,
        rawMarkdown: `# AI Agent Skills\n\nContextual instructions and agent rules for modern IDEs.`,
      };
    case 'workspace':
      return {
        title: 'Workspace & Filtering',
        subtitle:
          'Master PNPM workspace mechanics, filtering commands, and parallel task execution.',
        toc: WORKSPACE_TOC,
        rawMarkdown: `# Workspace Management\n\nPNPM workspace filtering and dependency management.`,
      };
    case 'deployment':
      return {
        title: 'Docker & Deployment',
        subtitle:
          'Production-grade multi-stage Dockerfiles, Docker Compose, and Vercel deployments.',
        toc: DEPLOYMENT_TOC,
        rawMarkdown: `# Docker & Deployment\n\nContainerizing and shipping Morax monorepos to production.`,
      };
    case 'trpc':
      return {
        title: 'tRPC API Layer',
        subtitle:
          'End-to-end typesafe client-server communications with zero code generation (Coming Soon).',
        toc: TRPC_TOC,
        rawMarkdown: `# tRPC in Morax\n\nEnd-to-end typesafe APIs across Next.js, Vite, Hono, and Express.`,
      };
    case 'orpc':
      return {
        title: 'oRPC API Layer',
        subtitle:
          'OpenAPI-first typesafe RPC framework with automatic Swagger spec generation (Coming Soon).',
        toc: ORPC_TOC,
        rawMarkdown: `# oRPC in Morax\n\nContract-first OpenAPI RPC framework for modern TypeScript monorepos.`,
      };
    case 'introduction':
    default:
      return {
        title: 'Introduction',
        subtitle: 'Introduction to Morax — The Next-Gen Monorepo Scaffolder.',
        toc: INTRODUCTION_TOC,
        rawMarkdown: `# Introduction to Morax\n\nMorax is an interactive developer CLI and dynamic scaffolding engine for PNPM Workspaces.`,
      };
  }
};
