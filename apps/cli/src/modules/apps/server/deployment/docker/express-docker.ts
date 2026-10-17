import fsPromises from 'fs/promises';
import path from 'path';
import type { ServerRuntime } from '../../types.js';

export function getExpressDockerfile(runtime: ServerRuntime): string {
  if (runtime === 'bun') {
    return [
      '# Production Dockerfile for Express (Bun runtime)',
      'FROM oven/bun:1-alpine',
      '',
      'WORKDIR /app',
      '',
      '# Copy root monorepo manifests',
      'COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./',
      'COPY apps/server/package.json ./apps/server/',
      'COPY packages/ ./packages/',
      '',
      '# Install dependencies',
      'RUN bun install || (npm install -g pnpm && pnpm install)',
      '',
      '# Copy server source code',
      'COPY apps/server/ ./apps/server/',
      '',
      'WORKDIR /app/apps/server',
      '',
      '# Build bundle with tsdown',
      'ENV SKIP_ENV_VALIDATION=true',
      'RUN bun run build || npx tsdown',
      '',
      'EXPOSE 3001',
      '',
      'CMD ["bun", "dist/index.js"]',
      '',
    ].join('\n');
  }

  return [
    '# Production Dockerfile for Express (Node.js runtime)',
    'FROM node:22-alpine',
    '',
    '# Install pnpm for monorepo resolution',
    'RUN npm install -g pnpm',
    '',
    'WORKDIR /app',
    '',
    '# Copy root monorepo manifests',
    'COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./',
    'COPY apps/server/package.json ./apps/server/',
    'COPY packages/ ./packages/',
    '',
    '# Install dependencies',
    'RUN pnpm install --frozen-lockfile || pnpm install',
    '',
    '# Copy server source code',
    'COPY apps/server/ ./apps/server/',
    '',
    'WORKDIR /app/apps/server',
    '',
    '# Build bundle with tsdown',
    'ENV SKIP_ENV_VALIDATION=true',
    'RUN pnpm build',
    '',
    'EXPOSE 3001',
    '',
    'CMD ["node", "dist/index.js"]',
    '',
  ].join('\n');
}

export async function setupExpressDocker(
  serverDir: string,
  runtime: ServerRuntime,
) {
  const dockerfileContent = getExpressDockerfile(runtime);
  await fsPromises.writeFile(
    path.join(serverDir, 'Dockerfile'),
    dockerfileContent,
    'utf8',
  );

  const dockerignoreContent = [
    'node_modules',
    'dist',
    '.env',
    '.env.local',
    '',
  ].join('\n');

  await fsPromises.writeFile(
    path.join(serverDir, '.dockerignore'),
    dockerignoreContent,
    'utf8',
  );
}
