import fsPromises from 'fs/promises';
import path from 'path';
import type { DbSelection, WebFramework } from '../../types/options.js';

export interface RootEnvOptions {
  db?: DbSelection;
  redis?: boolean;
  hasServer?: boolean;
  hasAuth?: boolean;
  webFramework?: WebFramework;
}

export async function setupRootEnv(
  projectPath: string,
  options: RootEnvOptions = {},
) {
  const envLines: string[] = [
    '# ==============================================================================',
    '# Workspace Environment Variables (.env)',
    '# Single source of truth for Docker Compose, shared packages, server, and web',
    '# ==============================================================================',
    '',
  ];

  const { db, redis, hasServer, hasAuth, webFramework } = options;

  // 1. Backend Server Variables
  if (hasServer) {
    envLines.push('# Server', 'PORT=3001', '');
  }

  // 2. Database Variables
  if (db && db.orm === 'drizzle') {
    if (db.dialect === 'sqlite') {
      envLines.push('# SQLite Database', 'DB_FILE_NAME=file:local.db', '');
    } else if (db.postgresProvider === 'neon') {
      envLines.push(
        '# Neon PostgreSQL Database',
        'DATABASE_URL=postgresql://username:password@ep-sample.us-east-2.aws.neon.tech/neondb?sslmode=require',
        '',
      );
    } else {
      // Docker / Local PostgreSQL
      envLines.push(
        '# PostgreSQL Database',
        'POSTGRES_USER=morax',
        'POSTGRES_PASSWORD=morax',
        'POSTGRES_DB=morax_db',
        'POSTGRES_PORT=5432',
        'DATABASE_URL=postgresql://morax:morax@127.0.0.1:5432/morax_db',
        '',
      );
    }
  }

  // 3. Redis Variables
  if (redis) {
    envLines.push('# Redis', 'REDIS_PORT=6379', '');
  }

  // 4. Better Auth Variables
  if (hasAuth) {
    envLines.push(
      '# Better Auth',
      'BETTER_AUTH_SECRET=secret-morax-auth-key-change-in-production',
      'BETTER_AUTH_URL=http://localhost:3001',
      'NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3001',
      '',
      '# CORS & Trusted Origins (JSON array or comma-separated URLs)',
      'CORS_ORIGIN=http://localhost:5173',
      'CLIENT_URL=["http://localhost:5173", "http://localhost:3000"]',
      '',
      '# Social Providers',
      'GOOGLE_CLIENT_ID=google-client-id',
      'GOOGLE_CLIENT_SECRET=google-client-secret',
      '# GITHUB_CLIENT_ID=',
      '# GITHUB_CLIENT_SECRET=',
      '',
      '# Cookie domain for cross-subdomain cookies (Optional)',
      '# COOKIE_DOMAIN=.localhost',
      '',
    );
  }

  // 4. Frontend Web Variables
  if (webFramework && webFramework !== 'skip') {
    if (webFramework === 'nextjs') {
      envLines.push(
        '# Next.js Frontend',
        'NEXT_PUBLIC_API_URL=http://localhost:3001',
        '',
      );
    } else {
      envLines.push(
        '# Vite React Frontend',
        'VITE_API_URL=http://localhost:3001',
        '',
      );
    }
  }

  const envContent = envLines.join('\n');
  await fsPromises.writeFile(
    path.join(projectPath, '.env'),
    envContent,
    'utf8',
  );
  await fsPromises.writeFile(
    path.join(projectPath, '.env.example'),
    envContent,
    'utf8',
  );
}
