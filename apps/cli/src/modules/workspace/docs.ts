import fsPromises from 'fs/promises';
import path from 'path';

export interface ProjectDocsOptions {
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
  hasEnv?: boolean;
  hasAuth?: boolean;
}

export async function setupProjectDocs(
  projectPath: string,
  options: ProjectDocsOptions,
) {
  const docsDir = path.join(projectPath, 'docs');
  await fsPromises.mkdir(docsDir, { recursive: true });

  const {
    projectName,
    hasServer,
    serverFramework,
    serverRuntime,
    hasDb,
    dbDialect,
    postgresProvider,
    hasDocker,
    hasDockerScripts,
    dockerServices,
    webFramework,
    hasEnv,
    hasAuth,
  } = options;

  // 1. docs/ARCHITECTURE.md
  const architectureMd = [
    `# Architecture Overview — ${projectName}`,
    '',
    'This document outlines the high-level architecture and workspace structure of this monorepo.',
    '',
    '## Workspace Strategy',
    'This project uses **pnpm workspaces** to orchestrate applications and shared libraries within a single repository:',
    '',
    '- **`apps/`**: Consumer applications and deployable services.',
    ...(hasServer
      ? [
          `  - **\`server\`**: Backend API built with ${serverFramework ?? 'Express'} (${serverRuntime ?? 'Node.js'}).`,
        ]
      : []),
    ...(webFramework && webFramework !== 'skip'
      ? [
          `  - **\`web\`**: Frontend user interface built with ${webFramework === 'nextjs' ? 'Next.js' : 'Vite React'}.`,
        ]
      : []),
    '- **`packages/`**: Shared internal libraries consumed across applications.',
    ...(hasDb
      ? [
          `  - **\`@repo/db\`**: Centralized database schemas, migrations, and Drizzle ORM client.`,
        ]
      : []),
    ...(hasEnv
      ? [
          `  - **\`@repo/env\`**: Type-safe environment validation schemas powered by Zod.`,
        ]
      : []),
    ...(hasAuth
      ? [
          `  - **\`@repo/auth\`**: Centralized Better Auth server instance and configuration.`,
        ]
      : []),
    '  - **`@config/typescript`**: Shared `tsconfig.json` base presets ensuring uniform compilation.',
    ...(hasDocker
      ? [
          '- **`docker/`**: Container configurations for local databases and caching infrastructure.',
        ]
      : []),
    ...(hasDockerScripts
      ? [
          '- **`scripts/`**: Container helper scripts (`docker.sh`, `docker.js`).',
        ]
      : []),
    '',
    '## Dependency Flow',
    '```text',
    'apps/web ──► @repo/env',
    'apps/server ──► @repo/db ──► @repo/env',
    '```',
    '',
    'Internal workspace dependencies are linked using pnpm workspace protocols (`workspace:*`).',
    '',
  ].join('\n');
  await fsPromises.writeFile(
    path.join(docsDir, 'ARCHITECTURE.md'),
    architectureMd,
    'utf8',
  );

  // 2. docs/DATABASE.md (if database is configured)
  if (hasDb) {
    const dbMd = [
      `# Database Architecture (@repo/db)`,
      '',
      `The database layer uses **Drizzle ORM** with **${dbDialect === 'sqlite' ? 'SQLite (LibSQL)' : `PostgreSQL (${postgresProvider ?? 'Docker'})`}**.`,
      '',
      '## Structure',
      '```text',
      'packages/db/',
      '├── src/',
      '│   ├── schema/             # Drizzle table schemas and type definitions',
      '│   │   └── index.ts',
      '│   ├── client.ts           # Initialized Drizzle client instance',
      '│   └── index.ts            # Public library exports',
      '├── drizzle/                # Generated SQL migration files',
      '└── drizzle.config.ts       # Drizzle Kit configuration',
      '```',
      '',
      '## Common Commands',
      '```bash',
      'pnpm --filter @repo/db db:push      # Push schema changes directly to the database',
      'pnpm --filter @repo/db db:generate  # Generate migration SQL files in drizzle/',
      'pnpm --filter @repo/db db:migrate   # Apply migration files',
      'pnpm --filter @repo/db db:studio    # Open visual Drizzle Studio inspector',
      '```',
      '',
      '## Importing the Database Client',
      '```typescript',
      "import { db, users } from '@repo/db';",
      '',
      'const allUsers = await db.select().from(users);',
      '```',
      '',
    ].join('\n');
    await fsPromises.writeFile(path.join(docsDir, 'DATABASE.md'), dbMd, 'utf8');
  }

  // 3. docs/SERVER.md (if server is configured)
  if (hasServer) {
    const serverMd = [
      `# Backend Server (apps/server)`,
      '',
      `High-performance backend API built with **${serverFramework ?? 'Express'}** on the **${serverRuntime ?? 'Node.js'}** runtime.`,
      '',
      '## Standard Endpoints',
      '| Method | Route | Description |',
      '| :--- | :--- | :--- |',
      '| `GET` | `/` | Service welcome message and status verification |',
      '| `GET` | `/health` | Uptime and health check endpoint for monitoring |',
      '| `GET` | `/api/v1/user` | User endpoint (queries `@repo/db` or returns sample user) |',
      '',
      '## Running Locally',
      '```bash',
      'pnpm --filter server dev     # Start development server with hot-reload',
      'pnpm --filter server build   # Build distribution bundle',
      'pnpm --filter server start   # Run production bundle',
      '```',
      '',
    ].join('\n');
    await fsPromises.writeFile(
      path.join(docsDir, 'SERVER.md'),
      serverMd,
      'utf8',
    );
  }

  // 4. docs/ENV.md (if env package is configured)
  if (hasEnv) {
    const envMd = [
      `# Environment Validation (@repo/env)`,
      '',
      'Type-safe environment management validated with **Zod** at runtime.',
      '',
      '## Architecture',
      'The `@repo/env` package provides unified access with namespace safety:',
      '',
      '```typescript',
      "import { env } from '@repo/env';",
      '',
      '// Backend server variables',
      'const port = env.server.PORT;',
      '',
      '// Database variables',
      'const dbUrl = env.db.DATABASE_URL;',
      '```',
      '',
      '## Validating All Environments',
      'Run the standalone check to verify all required variables without starting servers:',
      '```bash',
      'pnpm --filter @repo/env check',
      '```',
      '',
      '## Adding New Environment Variables',
      '1. Add the variable to `.env` and `.env.example`.',
      '2. Update the corresponding schema in `packages/env/src/schema/*.ts`.',
      '',
    ].join('\n');
    await fsPromises.writeFile(path.join(docsDir, 'ENV.md'), envMd, 'utf8');
  }

  // 5. docs/DOCKER.md (if docker is configured)
  if (hasDocker) {
    const dockerMd = [
      `# Docker Infrastructure`,
      '',
      'Local container infrastructure managed via Docker Compose.',
      '',
      '## Configured Services',
      ...(dockerServices?.postgres
        ? [
            '- **PostgreSQL**: Accessible at `localhost:5432` with credentials from `.env`.',
          ]
        : []),
      ...(dockerServices?.redis
        ? ['- **Redis**: Accessible at `localhost:6379`.']
        : []),
      '',
      '## Commands',
      ...(hasDockerScripts
        ? [
            '```bash',
            '# Local infrastructure commands',
            './scripts/command.sh infra-up       # Start all services in the background',
            './scripts/command.sh infra-down     # Stop all container services',
            ...(dockerServices?.postgres
              ? [
                  './scripts/command.sh postgres-up   # Start PostgreSQL container only',
                  './scripts/command.sh postgres-down # Stop PostgreSQL container only',
                ]
              : []),
            ...(dockerServices?.redis
              ? [
                  './scripts/command.sh redis-up      # Start Redis container only',
                  './scripts/command.sh redis-down    # Stop Redis container only',
                ]
              : []),
            '```',
          ]
        : [
            '```bash',
            '# Direct Docker Compose commands',
            'docker compose --env-file .env -f docker/docker-compose.yml up -d      # Start all services',
            'docker compose --env-file .env -f docker/docker-compose.yml down       # Stop all services',
            'docker compose --env-file .env -f docker/docker-compose.yml ps         # Check status',
            'docker compose --env-file .env -f docker/docker-compose.yml logs -f    # View logs',
            ...(dockerServices?.postgres
              ? [
                  'docker compose --env-file .env -f docker/docker-compose.yml --profile postgres up -d  # Postgres only',
                ]
              : []),
            ...(dockerServices?.redis
              ? [
                  'docker compose --env-file .env -f docker/docker-compose.yml --profile redis up -d     # Redis only',
                ]
              : []),
            '```',
          ]),
      '',
      'Docker Compose automatically loads root variables using `--env-file .env`.',
      '',
    ].join('\n');
    await fsPromises.writeFile(
      path.join(docsDir, 'DOCKER.md'),
      dockerMd,
      'utf8',
    );
  }

  // 6. docs/WEB.md (if web application is configured)
  if (webFramework && webFramework !== 'skip') {
    const webMd = [
      `# Frontend Application (apps/web)`,
      '',
      `Modern frontend user interface built with **${webFramework === 'nextjs' ? 'Next.js (App Router)' : 'React (Vite)'}**.`,
      '',
      '## Styling & Components',
      '- **Tailwind CSS v4**: Theme tokens and utility classes.',
      '- **shadcn UI & Lucide Icons**: Accessible, pre-styled UI components.',
      '',
      '## Commands',
      '```bash',
      'pnpm --filter web dev     # Launch local development server',
      'pnpm --filter web build   # Build production static/SSR output',
      '```',
      '',
    ].join('\n');
    await fsPromises.writeFile(path.join(docsDir, 'WEB.md'), webMd, 'utf8');
  }

  // 7. docs/AUTH.md (if Better Auth is configured)
  if (hasAuth) {
    const authMd = [
      `# Authentication Architecture (@repo/auth)`,
      '',
      'Type-safe authentication and session management powered by **Better Auth** with **Drizzle ORM**.',
      '',
      '## Structure',
      '```text',
      'packages/auth/',
      '├── src/',
      '│   ├── index.ts        # Server auth instance: betterAuth({...})',
      '│   └── origins.ts      # Allowed trusted CORS origins',
      '└── package.json',
      '```',
      '',
      '## Server Mounting',
      serverFramework === 'hono'
        ? [
            'Better Auth is mounted on the Hono backend at `/api/auth/**`:',
            '```typescript',
            "import { auth } from '@repo/auth';",
            '',
            "app.on(['POST', 'GET'], '/api/auth/**', (c) => auth.handler(c.req.raw));",
            '```',
          ].join('\n')
        : [
            'Better Auth is mounted on the Express backend at `/api/auth/*`:',
            '```typescript',
            "import { auth } from '@repo/auth';",
            "import { toNodeHandler } from 'better-auth/node';",
            '',
            "app.all('/api/auth/*', toNodeHandler(auth));",
            '```',
          ].join('\n'),
      '',
      '## Database Schemas',
      'Better Auth tables are declared in `packages/db/src/schema/auth.ts` and exported via `@repo/db`:',
      '- `user`: User profiles and verification flags',
      '- `session`: Active authenticated user sessions',
      '- `account`: OAuth and credential login links',
      '- `verification`: Email verification and password reset tokens',
      '',
    ].join('\n');
    await fsPromises.writeFile(path.join(docsDir, 'AUTH.md'), authMd, 'utf8');
  }
}
