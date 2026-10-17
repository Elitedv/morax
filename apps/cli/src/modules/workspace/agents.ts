import fsPromises from 'fs/promises';
import path from 'path';

export interface AgentDocsOptions {
  projectName: string;
  hasServer: boolean;
  serverFramework?: 'express' | 'hono';
  serverRuntime?: 'node' | 'bun';
  hasDb: boolean;
  orm?: 'drizzle';
  dbDialect?: 'postgresql' | 'sqlite';
  postgresProvider?: 'docker' | 'neon';
  hasDocker?: boolean;
  hasDockerScripts?: boolean;
  dockerServices?: { postgres?: boolean; redis?: boolean };
  hasRedis?: boolean;
  webFramework?: 'nextjs' | 'react' | 'skip';
  linter?: string;
  formatter?: string;
  hasEnv?: boolean;
  hasAuth?: boolean;
}

export function generateClaudeMd(options: AgentDocsOptions): string {
  const {
    projectName,
    hasServer,
    serverFramework,
    serverRuntime,
    hasDb,
    orm,
    dbDialect,
    postgresProvider,
    hasDocker,
    hasDockerScripts,
    dockerServices,
    webFramework,
    linter,
    formatter,
    hasEnv,
    hasAuth,
  } = options;

  const stack: string[] = ['- **Package Manager**: pnpm (workspaces)'];
  if (hasServer) {
    stack.push(
      `- **Backend Server**: ${serverFramework ?? 'express'} (${serverRuntime ?? 'node'}) in \`apps/server\``,
    );
  }
  if (webFramework && webFramework !== 'skip') {
    stack.push(
      `- **Frontend Web**: ${webFramework === 'nextjs' ? 'Next.js (App Router)' : 'React (Vite)'} in \`apps/web\``,
    );
  }
  if (hasDb && orm === 'drizzle') {
    stack.push(
      `- **Database & ORM**: Drizzle ORM (${dbDialect ?? 'postgresql'}${postgresProvider ? ` - ${postgresProvider}` : ''}) in \`packages/db\``,
    );
  }
  if (hasAuth) {
    stack.push(
      '- **Authentication**: Better Auth with Drizzle adapter in `@repo/auth`',
    );
  }
  if (hasEnv) {
    stack.push(
      '- **Environment Validation**: Type-safe `@repo/env` with Zod validation',
    );
  }
  if (hasDocker) {
    const services = [
      dockerServices?.postgres ? 'PostgreSQL' : null,
      dockerServices?.redis ? 'Redis' : null,
    ]
      .filter(Boolean)
      .join(', ');
    stack.push(
      `- **Docker Infrastructure**: Compose services (${services || 'local containers'})`,
    );
  }
  if (linter && linter !== 'none') {
    stack.push(`- **Linter**: ${linter}`);
  }
  if (formatter && formatter !== 'none') {
    stack.push(`- **Formatter**: ${formatter}`);
  }

  const commands: string[] = [
    '```bash',
    '# Development',
    'pnpm dev                # Start all applications concurrently',
    'pnpm build              # Build all workspace applications and packages',
    '',
    '# Code Quality',
    'pnpm lint               # Run linter across all workspaces',
    'pnpm format             # Format codebase files',
  ];

  if (hasEnv) {
    commands.push(
      'pnpm --filter @repo/env check # Validate all environment variables',
    );
  }

  if (hasDocker) {
    if (hasDockerScripts) {
      commands.push(
        '',
        '# Docker Infrastructure (Runner script)',
        './scripts/command.sh infra-up          # Start Docker infrastructure services',
        './scripts/command.sh infra-down        # Stop Docker infrastructure services',
      );
    } else {
      commands.push(
        '',
        '# Docker Infrastructure',
        'docker compose --env-file .env -f docker/docker-compose.yml up -d   # Start Docker services',
        'docker compose --env-file .env -f docker/docker-compose.yml down    # Stop Docker services',
      );
    }
  }

  if (hasDb) {
    commands.push(
      '',
      '# Database (Drizzle ORM)',
      'pnpm --filter @repo/db db:push      # Push schema directly to database',
      'pnpm --filter @repo/db db:studio    # Launch visual Drizzle Studio GUI',
      'pnpm --filter @repo/db db:generate  # Generate migration SQL files',
    );
  }

  commands.push('```');

  return [
    `# CLAUDE.md — Agent & Assistant Guide for ${projectName}`,
    '',
    'This file provides guidelines and architectural context for Claude Code and AI assistants working in this repository.',
    '',
    '## Technology Stack',
    ...stack,
    '',
    '## Workspace Structure',
    '```text',
    `${projectName}/`,
    '├── apps/',
    ...(hasServer ? ['│   ├── server/             # Backend API service'] : []),
    ...(webFramework && webFramework !== 'skip'
      ? ['│   └── web/                # Frontend application']
      : []),
    '├── packages/',
    ...(hasDb
      ? [
          '│   ├── db/                 # Drizzle ORM client, schemas & migrations',
        ]
      : []),
    ...(hasAuth
      ? [
          '│   ├── auth/               # Shared Better Auth server & client (@repo/auth)',
        ]
      : []),
    ...(hasEnv
      ? [
          '│   ├── env/                # Type-safe environment schemas (@repo/env)',
        ]
      : []),
    '│   └── typescript/         # Shared TypeScript configs (@config/typescript)',
    ...(hasDocker
      ? ['├── docker/                 # docker-compose.yml configuration']
      : []),
    ...(hasDockerScripts
      ? ['├── scripts/                # Helper scripts (docker.sh, docker.js)']
      : []),
    '├── .env                    # Monorepo single source of truth for secrets',
    '└── package.json            # Root workspace orchestrator',
    '```',
    '',
    '## Key Commands',
    ...commands,
    '',
    '## Core Architecture & Conventions',
    '1. **Type-Safe Environment Variables**:',
    ...(hasEnv
      ? [
          '   - Never read `process.env` directly in server or database code.',
          '   - Use `@repo/env` namespace accessors: `env.server.PORT`, `env.db.DATABASE_URL`, `env.docker.*`.',
          "   - In frontend React/Vite, use `import { env } from '@repo/env/web'` or static `import.meta.env.*`.",
        ]
      : ['   - All infrastructure credentials live in the root `.env` file.']),
    ...(hasDb
      ? [
          '2. **Database & Schema Rules**:',
          '   - All Drizzle schemas are defined in `packages/db/src/schema/`.',
          '   - Export tables and inferred types (`User`, `NewUser`) from `schema/index.ts`.',
          '   - Run `pnpm --filter @repo/db db:push` during prototyping or `db:generate` for migration files.',
        ]
      : []),
    ...(hasServer
      ? [
          '3. **Backend API Endpoints**:',
          '   - Root welcome/health: `GET /`',
          '   - Healthcheck: `GET /health`',
          '   - User resource: `GET /api/v1/user`',
        ]
      : []),
    '4. **TypeScript & Imports**:',
    '   - Strict mode is enforced across all packages.',
    '   - Monorepo packages use workspace dependencies (e.g. `@repo/db: "workspace:*"`).',
    '',
  ].join('\n');
}

export function generateAgentsMd(options: AgentDocsOptions): string {
  const { projectName } = options;

  return [
    `# AGENTS.md — Universal AI Agent Guidelines for ${projectName}`,
    '',
    'This document defines behavior rules, code conventions, and system architecture for AI agents (Cursor, Antigravity, Windsurf, Copilot, Codex) modifying this repository.',
    '',
    '## Project Overview',
    `This repository is a modern high-performance monorepo workspace scaffolded by Morax CLI.`,
    '',
    '## Agent Behavioral Rules',
    '- **Preserve Monorepo Isolation**: Keep dependencies localized to their appropriate `apps/` or `packages/` workspace.',
    '- **Never Break TypeScript Builds**: Run `pnpm lint` and ensure type-checking passes before proposing file modifications.',
    '- **Preserve Documentation & Comments**: Retain existing docstrings, explanatory comments, and configuration flags.',
    '- **Environment Variables**: Add new required variables to `.env.example` whenever adding a new environment variable.',
    '',
    '## Working with Workspaces',
    '- Execute workspace-targeted commands using `pnpm --filter <workspace-name> <command>`.',
    '- For all workspace-wide builds, run `pnpm build` from the monorepo root.',
    '- To add a package to a specific workspace: `pnpm --filter <workspace-name> add <package>`.',
    '',
    'For specific stack details and commands, refer to [`CLAUDE.md`](./CLAUDE.md) and [`README.md`](./README.md).',
    '',
  ].join('\n');
}

export async function setupAgentDocs(
  projectPath: string,
  options: AgentDocsOptions,
) {
  const claudeContent = generateClaudeMd(options);
  const agentsContent = generateAgentsMd(options);

  await fsPromises.writeFile(
    path.join(projectPath, 'CLAUDE.md'),
    claudeContent,
    'utf8',
  );
  await fsPromises.writeFile(
    path.join(projectPath, 'AGENTS.md'),
    agentsContent,
    'utf8',
  );
}
