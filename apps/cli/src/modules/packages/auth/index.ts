import fsPromises from 'fs/promises';
import path from 'path';
import { confirm, spinner } from '@clack/prompts';
import pc from 'picocolors';
import handleCancel from '../../../utils/isCancel.js';
import type {
  DbDialect,
  ServerFramework,
  ServerRuntime,
  WebFramework,
} from '../../../types/options.js';

export interface AuthSetupOptions {
  projectPath: string;
  dialect?: DbDialect;
  serverFramework: ServerFramework;
  serverRuntime: ServerRuntime;
  webFramework: WebFramework;
  hasServer: boolean;
  hasWeb: boolean;
  hasEnv: boolean;
}

export async function promptAuth(): Promise<boolean> {
  const result = await confirm({
    message: 'Configure authentication (Better Auth)?',
    initialValue: true,
  });

  handleCancel(result);
  return result as boolean;
}

export async function setupAuth(options: AuthSetupOptions) {
  const {
    projectPath,
    dialect,
    serverFramework,
    webFramework,
    hasServer,
    hasWeb,
    hasEnv,
  } = options;

  const s = spinner();
  s.start('Configuring shared Better Auth package (@repo/auth)...');

  try {
    const authDir = path.join(projectPath, 'packages', 'auth');
    const authSrcDir = path.join(authDir, 'src');
    await fsPromises.mkdir(authSrcDir, { recursive: true });

    // 1. packages/auth/package.json
    const authPkg = {
      name: '@repo/auth',
      version: '1.0.0',
      description: 'Shared Better Auth server and client configurations',
      private: true,
      type: 'module',
      main: './src/index.ts',
      types: './src/index.ts',
      exports: {
        '.': {
          types: './src/index.ts',
          default: './src/index.ts',
        },
        './client': {
          types: './src/client.ts',
          default: './src/client.ts',
        },
      },
      scripts: {
        build: 'tsc',
      },
      dependencies: {
        '@repo/db': 'workspace:*',
        'better-auth': '^1.1.21',
        ...(hasEnv ? { '@repo/env': 'workspace:*' } : {}),
      },
      devDependencies: {
        '@config/typescript': 'workspace:*',
        typescript: '^5.7.3',
      },
      peerDependencies: {
        react: '^19.0.0',
      },
      peerDependenciesMeta: {
        react: {
          optional: true,
        },
      },
    };

    await fsPromises.writeFile(
      path.join(authDir, 'package.json'),
      JSON.stringify(authPkg, null, 2),
      'utf8',
    );

    // 2. packages/auth/tsconfig.json
    const tsconfig = {
      extends: '@config/typescript/tsconfig.json',
      compilerOptions: {
        rootDir: 'src',
        outDir: 'dist',
      },
      include: ['src/**/*'],
    };

    await fsPromises.writeFile(
      path.join(authDir, 'tsconfig.json'),
      JSON.stringify(tsconfig, null, 2),
      'utf8',
    );

    // 3. packages/auth/src/origins.ts
    const originsContent = [
      '/**',
      ' * Allowed trusted origins for CORS and Better Auth callbacks',
      ' */',
      'export const trustedOrigins = [',
      "  process.env.WEB_URL || 'http://localhost:3000',",
      "  process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',",
      "  'http://localhost:3000',",
      "  'http://localhost:5173',",
      '];',
      '',
    ].join('\n');

    await fsPromises.writeFile(
      path.join(authSrcDir, 'origins.ts'),
      originsContent,
      'utf8',
    );

    // 4. packages/auth/src/index.ts
    const isSqlite = dialect === 'sqlite';
    const authIndexContent = [
      "import { betterAuth } from 'better-auth';",
      "import { drizzleAdapter } from 'better-auth/adapters/drizzle';",
      "import { db } from '@repo/db';",
      "import * as schema from '@repo/db/schema';",
      "import { trustedOrigins } from './origins.js';",
      '',
      '/**',
      ' * Centralized Better Auth Server Configuration',
      ' */',
      'export const auth = betterAuth({',
      '  database: drizzleAdapter(db, {',
      `    provider: '${isSqlite ? 'sqlite' : 'pg'}',`,
      '    schema: {',
      '      ...schema,',
      '    },',
      '  }),',
      "  secret: process.env.BETTER_AUTH_SECRET || 'secret-morax-auth-key-change-in-production',",
      "  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3001',",
      '  trustedOrigins,',
      '  emailAndPassword: {',
      '    enabled: true,',
      '  },',
      '});',
      '',
      'export type Auth = typeof auth;',
      "export { trustedOrigins } from './origins.js';",
      '',
    ].join('\n');

    await fsPromises.writeFile(
      path.join(authSrcDir, 'index.ts'),
      authIndexContent,
      'utf8',
    );

    // 5. packages/auth/src/client.ts
    const authClientContent = [
      "import { createAuthClient } from 'better-auth/react';",
      '',
      '/**',
      ' * Type-Safe Better Auth Client for Web Applications',
      ' */',
      'export const authClient = createAuthClient({',
      '  baseURL:',
      "    typeof window !== 'undefined'",
      '      ? window.location.origin',
      "      : process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3001',",
      '});',
      '',
      'export const { signIn, signOut, signUp, useSession } = authClient;',
      '',
    ].join('\n');

    await fsPromises.writeFile(
      path.join(authSrcDir, 'client.ts'),
      authClientContent,
      'utf8',
    );

    // 6. Generate packages/db/src/schema/auth.ts (Drizzle schema)
    const dbDir = path.join(projectPath, 'packages', 'db');
    const schemaDir = path.join(dbDir, 'src', 'schema');
    await fsPromises.mkdir(schemaDir, { recursive: true });

    let authSchemaContent: string;
    if (isSqlite) {
      authSchemaContent = [
        "import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';",
        '',
        "export const user = sqliteTable('user', {",
        "  id: text('id').primaryKey(),",
        "  name: text('name').notNull(),",
        "  email: text('email').notNull().unique(),",
        "  emailVerified: integer('email_verified', { mode: 'boolean' }).default(false).notNull(),",
        "  image: text('image'),",
        "  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),",
        "  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),",
        '});',
        '',
        "export const session = sqliteTable('session', {",
        "  id: text('id').primaryKey(),",
        "  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),",
        "  token: text('token').notNull().unique(),",
        "  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),",
        "  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),",
        "  ipAddress: text('ip_address'),",
        "  userAgent: text('user_agent'),",
        "  userId: text('user_id')",
        '    .notNull()',
        "    .references(() => user.id, { onDelete: 'cascade' }),",
        '});',
        '',
        "export const account = sqliteTable('account', {",
        "  id: text('id').primaryKey(),",
        "  accountId: text('account_id').notNull(),",
        "  providerId: text('provider_id').notNull(),",
        "  userId: text('user_id')",
        '    .notNull()',
        "    .references(() => user.id, { onDelete: 'cascade' }),",
        "  accessToken: text('access_token'),",
        "  refreshToken: text('refresh_token'),",
        "  idToken: text('id_token'),",
        "  accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp' }),",
        "  refreshTokenExpiresAt: integer('refreshToken_expires_at', { mode: 'timestamp' }),",
        "  scope: text('scope'),",
        "  password: text('password'),",
        "  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),",
        "  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),",
        '});',
        '',
        "export const verification = sqliteTable('verification', {",
        "  id: text('id').primaryKey(),",
        "  identifier: text('identifier').notNull(),",
        "  value: text('value').notNull(),",
        "  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),",
        "  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),",
        "  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),",
        '});',
        '',
        'export type User = typeof user.$inferSelect;',
        'export type Session = typeof session.$inferSelect;',
        'export type Account = typeof account.$inferSelect;',
        'export type Verification = typeof verification.$inferSelect;',
        '',
      ].join('\n');
    } else {
      authSchemaContent = [
        "import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';",
        '',
        "export const user = pgTable('user', {",
        "  id: text('id').primaryKey(),",
        "  name: text('name').notNull(),",
        "  email: text('email').notNull().unique(),",
        "  emailVerified: boolean('email_verified').default(false).notNull(),",
        "  image: text('image'),",
        "  createdAt: timestamp('created_at').defaultNow().notNull(),",
        "  updatedAt: timestamp('updated_at').defaultNow().notNull(),",
        '});',
        '',
        "export const session = pgTable('session', {",
        "  id: text('id').primaryKey(),",
        "  expiresAt: timestamp('expires_at').notNull(),",
        "  token: text('token').notNull().unique(),",
        "  createdAt: timestamp('created_at').defaultNow().notNull(),",
        "  updatedAt: timestamp('updated_at').defaultNow().notNull(),",
        "  ipAddress: text('ip_address'),",
        "  userAgent: text('user_agent'),",
        "  userId: text('user_id')",
        '    .notNull()',
        "    .references(() => user.id, { onDelete: 'cascade' }),",
        '});',
        '',
        "export const account = pgTable('account', {",
        "  id: text('id').primaryKey(),",
        "  accountId: text('account_id').notNull(),",
        "  providerId: text('provider_id').notNull(),",
        "  userId: text('user_id')",
        '    .notNull()',
        "    .references(() => user.id, { onDelete: 'cascade' }),",
        "  accessToken: text('access_token'),",
        "  refreshToken: text('refresh_token'),",
        "  idToken: text('id_token'),",
        "  accessTokenExpiresAt: timestamp('access_token_expires_at'),",
        "  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),",
        "  scope: text('scope'),",
        "  password: text('password'),",
        "  createdAt: timestamp('created_at').defaultNow().notNull(),",
        "  updatedAt: timestamp('updated_at').defaultNow().notNull(),",
        '});',
        '',
        "export const verification = pgTable('verification', {",
        "  id: text('id').primaryKey(),",
        "  identifier: text('identifier').notNull(),",
        "  value: text('value').notNull(),",
        "  expiresAt: timestamp('expires_at').notNull(),",
        "  createdAt: timestamp('created_at').defaultNow().notNull(),",
        "  updatedAt: timestamp('updated_at').defaultNow().notNull(),",
        '});',
        '',
        'export type User = typeof user.$inferSelect;',
        'export type Session = typeof session.$inferSelect;',
        'export type Account = typeof account.$inferSelect;',
        'export type Verification = typeof verification.$inferSelect;',
        '',
      ].join('\n');
    }

    await fsPromises.writeFile(
      path.join(schemaDir, 'auth.ts'),
      authSchemaContent,
      'utf8',
    );

    // 7. Update packages/db/src/schema/index.ts to re-export auth schemas
    const schemaIndexPath = path.join(schemaDir, 'index.ts');
    try {
      const existing = await fsPromises.readFile(schemaIndexPath, 'utf8');
      if (
        !existing.includes("from './auth.js'") &&
        !existing.includes("from './auth'")
      ) {
        const updated = `${existing}\nexport * from './auth.js';\n`;
        await fsPromises.writeFile(schemaIndexPath, updated, 'utf8');
      }
    } catch {}

    // 8. Mount Better Auth in apps/server (if server exists)
    if (hasServer && serverFramework !== 'none') {
      const serverDir = path.join(projectPath, 'apps', 'server');
      const serverPkgPath = path.join(serverDir, 'package.json');

      try {
        const rawPkg = await fsPromises.readFile(serverPkgPath, 'utf8');
        const pkg = JSON.parse(rawPkg);
        pkg.dependencies = pkg.dependencies || {};
        pkg.dependencies['@repo/auth'] = 'workspace:*';
        if (serverFramework === 'express') {
          pkg.dependencies['better-auth'] = '^1.1.21';
        }
        await fsPromises.writeFile(
          serverPkgPath,
          JSON.stringify(pkg, null, 2),
          'utf8',
        );
      } catch {}

      // Update apps/server/src/index.ts to mount auth routes
      const serverIndexPath = path.join(serverDir, 'src', 'index.ts');
      try {
        let content = await fsPromises.readFile(serverIndexPath, 'utf8');

        if (serverFramework === 'express') {
          if (!content.includes('@repo/auth')) {
            content = content.replace(
              "import express from 'express';",
              "import express from 'express';\nimport { auth, trustedOrigins } from '@repo/auth';\nimport { toNodeHandler } from 'better-auth/node';",
            );
            // Replace basic cors with credentials-enabled cors
            content = content.replace(
              'app.use(cors());',
              'app.use(\n  cors({\n    origin: trustedOrigins,\n    credentials: true,\n  }),\n);',
            );
            // Mount auth handler right before app.use(express.json());
            content = content.replace(
              'app.use(express.json());',
              "// Mount Better Auth endpoints (/api/auth/*)\napp.all('/api/auth/*', toNodeHandler(auth));\n\napp.use(express.json());",
            );
            await fsPromises.writeFile(serverIndexPath, content, 'utf8');
          }
        } else if (serverFramework === 'hono') {
          if (!content.includes('@repo/auth')) {
            content = content.replace(
              "import { Hono } from 'hono';",
              "import { Hono } from 'hono';\nimport { auth, trustedOrigins } from '@repo/auth';",
            );
            // Replace basic cors with credentials-enabled cors
            content = content.replace(
              "app.use('*', cors());",
              "app.use(\n  '*',\n  cors({\n    origin: (origin) => (trustedOrigins.includes(origin) ? origin : trustedOrigins[0]),\n    credentials: true,\n  }),\n);",
            );
            // Mount auth handler after cors
            content = content.replace(
              'const app = new Hono();',
              "const app = new Hono();\n\n// Mount Better Auth API handler\napp.on(['POST', 'GET'], '/api/auth/**', (c) => {\n  return auth.handler(c.req.raw);\n});",
            );
            await fsPromises.writeFile(serverIndexPath, content, 'utf8');
          }
        }
      } catch {}
    }

    // 9. Add @repo/auth to apps/web (if web exists)
    if (hasWeb && webFramework !== 'skip') {
      const webDir = path.join(projectPath, 'apps', 'web');
      const webPkgPath = path.join(webDir, 'package.json');
      try {
        const rawPkg = await fsPromises.readFile(webPkgPath, 'utf8');
        const pkg = JSON.parse(rawPkg);
        pkg.dependencies = pkg.dependencies || {};
        pkg.dependencies['@repo/auth'] = 'workspace:*';
        await fsPromises.writeFile(
          webPkgPath,
          JSON.stringify(pkg, null, 2),
          'utf8',
        );
      } catch {}
    }

    // 10. Update root .env and .env.example
    const envLinesToAdd = [
      '# Better Auth',
      'BETTER_AUTH_SECRET=secret-morax-auth-key-change-in-production',
      'BETTER_AUTH_URL=http://localhost:3001',
      'NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3001',
      '',
    ].join('\n');

    for (const envFileName of ['.env', '.env.example']) {
      const envFilePath = path.join(projectPath, envFileName);
      try {
        const raw = await fsPromises.readFile(envFilePath, 'utf8');
        if (!raw.includes('BETTER_AUTH_SECRET')) {
          await fsPromises.appendFile(
            envFilePath,
            `\n${envLinesToAdd}`,
            'utf8',
          );
        }
      } catch {}
    }

    // 11. If @repo/env is configured, add Better Auth variables to schemas
    if (hasEnv) {
      const envPkgDir = path.join(projectPath, 'packages', 'env');
      const serverEnvFile = path.join(envPkgDir, 'src', 'schema', 'server.ts');
      const webEnvFile = path.join(envPkgDir, 'src', 'schema', 'web.ts');

      try {
        let serverEnvContent = await fsPromises.readFile(serverEnvFile, 'utf8');
        if (!serverEnvContent.includes('BETTER_AUTH_SECRET')) {
          const authFields = [
            '  BETTER_AUTH_SECRET: z.string({',
            "    required_error: 'BETTER_AUTH_SECRET is required. Please declare BETTER_AUTH_SECRET in root .env',",
            '  }),',
            "  BETTER_AUTH_URL: z.string().url().default('http://localhost:3001'),",
          ].join('\n');
          serverEnvContent = serverEnvContent.replace(
            'export const serverSchema = z.object({',
            `export const serverSchema = z.object({\n${authFields}`,
          );
          await fsPromises.writeFile(serverEnvFile, serverEnvContent, 'utf8');
        }
      } catch {}

      try {
        let webEnvContent = await fsPromises.readFile(webEnvFile, 'utf8');
        if (!webEnvContent.includes('NEXT_PUBLIC_BETTER_AUTH_URL')) {
          const authWebField =
            "  NEXT_PUBLIC_BETTER_AUTH_URL: z.string().url().default('http://localhost:3001'),";
          webEnvContent = webEnvContent.replace(
            'export const webSchema = z.object({',
            `export const webSchema = z.object({\n${authWebField}`,
          );
          webEnvContent = webEnvContent.replace(
            'const clientEnv = {',
            'const clientEnv = {\n  NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,',
          );
          await fsPromises.writeFile(webEnvFile, webEnvContent, 'utf8');
        }
      } catch {}
    }

    s.stop(
      pc.green(
        '✔ Success: Better Auth configured in packages/auth & packages/db',
      ),
    );
  } catch (error: any) {
    s.stop(pc.red('✖ Failed: Better Auth setup encountered an error'));
    console.error(pc.red(`\nError details: ${error.message || error}`));
  }
}
