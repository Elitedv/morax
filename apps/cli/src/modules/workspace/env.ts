import fsPromises from 'fs/promises';
import path from 'path';
import type { DbSelection } from '../../types/options.js';

export interface RootEnvOptions {
  db?: DbSelection;
  redis?: boolean;
  hasServer?: boolean;
  webFramework?: 'nextjs' | 'react' | 'skip';
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

  const { db, redis, hasServer, webFramework } = options;

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
