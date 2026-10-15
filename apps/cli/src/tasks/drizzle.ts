import { select, spinner } from '@clack/prompts';
import pc from 'picocolors';
import handleCancel from '../utils/isCancel.js';
import fsPromises from 'fs/promises';
import path from 'path';
import { runCommand } from '../utils/exec.js';

export async function promptDrizzle(): Promise<string> {
  const dialectChoice = await select({
    message: 'Which database dialect would you like to use with Drizzle?',
    options: [
      {
        value: 'postgresql',
        label: 'PostgreSQL',
        hint: 'Recommended (Postgres.js / Neon / Supabase / Docker)',
      },
      {
        value: 'sqlite',
        label: 'SQLite / LibSQL',
        hint: 'Lightweight local SQLite or Turso DB',
      },
      {
        value: 'mysql',
        label: 'MySQL',
        hint: 'MySQL2 / PlanetScale',
      },
    ],
    initialValue: 'postgresql',
  });

  handleCancel(dialectChoice);
  return dialectChoice as string;
}

export async function setupDrizzle(
  projectPath: string,
  dialect: string = 'postgresql',
  linter: string = 'none',
) {
  const dbDir = path.join(projectPath, 'packages', 'db');
  const srcDir = path.join(dbDir, 'src');
  const schemaDir = path.join(srcDir, 'schema');

  // 1. Create directory structure packages/db/src/schema recursively
  await fsPromises.mkdir(schemaDir, { recursive: true });

  // 2. Initialize package.json using pnpm init
  await runCommand('pnpm init', { cwd: dbDir, silent: true });

  // 3. Customize packages/db/package.json
  const dbPackagePath = path.join(dbDir, 'package.json');
  const dbPackageRaw = await fsPromises.readFile(dbPackagePath, 'utf8');
  const dbPkg = JSON.parse(dbPackageRaw);

  dbPkg.name = '@repo/db';
  dbPkg.version = '1.0.0';
  dbPkg.private = true;
  dbPkg.type = 'module';
  dbPkg.main = './src/index.ts';
  dbPkg.types = './src/index.ts';
  dbPkg.exports = {
    '.': {
      types: './src/index.ts',
      default: './src/index.ts',
    },
    './schema': {
      types: './src/schema/index.ts',
      default: './src/schema/index.ts',
    },
  };
  dbPkg.scripts = {
    build: 'tsc',
    'db:generate': 'drizzle-kit generate',
    'db:migrate': 'drizzle-kit migrate',
    'db:push': 'drizzle-kit push',
    'db:studio': 'drizzle-kit studio',
    'db:check': 'drizzle-kit check',
  };

  if (linter === 'biome') {
    dbPkg.scripts.lint = 'biome lint .';
  } else if (linter === 'oxlint') {
    dbPkg.scripts.lint = 'oxlint .';
  }

  dbPkg.devDependencies = {
    '@config/typescript': 'workspace:*',
  };

  // Remove defaults that are not needed
  delete dbPkg.keywords;
  delete dbPkg.author;
  delete dbPkg.license;

  await fsPromises.writeFile(
    dbPackagePath,
    JSON.stringify(dbPkg, null, 2),
    'utf8',
  );

  // 4. Create tsconfig.json extending the base shared config
  const tsconfigContent = {
    extends: '@config/typescript/tsconfig.json',
    compilerOptions: {
      rootDir: 'src',
      outDir: 'dist',
      declaration: true,
    },
    include: ['src/**/*', 'drizzle.config.ts'],
  };

  await fsPromises.writeFile(
    path.join(dbDir, 'tsconfig.json'),
    JSON.stringify(tsconfigContent, null, 2),
    'utf8',
  );

  // 5. Install dependencies dynamically using pnpm add
  if (dialect === 'postgresql') {
    await runCommand('pnpm add drizzle-orm postgres dotenv', {
      cwd: dbDir,
      silent: false,
    });
  } else if (dialect === 'sqlite') {
    await runCommand('pnpm add drizzle-orm @libsql/client dotenv', {
      cwd: dbDir,
      silent: false,
    });
  } else if (dialect === 'mysql') {
    await runCommand('pnpm add drizzle-orm mysql2 dotenv', {
      cwd: dbDir,
      silent: false,
    });
  }

  await runCommand(
    'pnpm add -D drizzle-kit @types/node tsx typescript@latest',
    {
      cwd: dbDir,
      silent: false,
    },
  );

  // 6. Generate drizzle.config.ts based on chosen dialect
  let drizzleConfigContent = '';
  if (dialect === 'postgresql') {
    drizzleConfigContent = [
      "import { defineConfig } from 'drizzle-kit';",
      "import 'dotenv/config';",
      '',
      'export default defineConfig({',
      "  out: './drizzle',",
      "  schema: './src/schema/index.ts',",
      "  dialect: 'postgresql',",
      '  dbCredentials: {',
      "    url: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/morax_db',",
      '  },',
      '});',
      '',
    ].join('\n');
  } else if (dialect === 'sqlite') {
    drizzleConfigContent = [
      "import { defineConfig } from 'drizzle-kit';",
      "import 'dotenv/config';",
      '',
      'export default defineConfig({',
      "  out: './drizzle',",
      "  schema: './src/schema/index.ts',",
      "  dialect: 'turso',",
      '  dbCredentials: {',
      "    url: process.env.DATABASE_URL || 'file:local.db',",
      '    authToken: process.env.DATABASE_AUTH_TOKEN,',
      '  },',
      '});',
      '',
    ].join('\n');
  } else if (dialect === 'mysql') {
    drizzleConfigContent = [
      "import { defineConfig } from 'drizzle-kit';",
      "import 'dotenv/config';",
      '',
      'export default defineConfig({',
      "  out: './drizzle',",
      "  schema: './src/schema/index.ts',",
      "  dialect: 'mysql',",
      '  dbCredentials: {',
      "    url: process.env.DATABASE_URL || 'mysql://root:password@localhost:3306/morax_db',",
      '  },',
      '});',
      '',
    ].join('\n');
  }

  await fsPromises.writeFile(
    path.join(dbDir, 'drizzle.config.ts'),
    drizzleConfigContent,
    'utf8',
  );

  // 7. Generate src/schema/index.ts with idiomatic starter schemas
  let schemaContent = '';
  if (dialect === 'postgresql') {
    schemaContent = [
      "import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';",
      '',
      "export const users = pgTable('users', {",
      "  id: uuid('id').defaultRandom().primaryKey(),",
      "  name: text('name').notNull(),",
      "  email: text('email').notNull().unique(),",
      "  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),",
      "  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),",
      '});',
      '',
      'export type User = typeof users.$inferSelect;',
      'export type NewUser = typeof users.$inferInsert;',
      '',
    ].join('\n');
  } else if (dialect === 'sqlite') {
    schemaContent = [
      "import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';",
      '',
      "export const users = sqliteTable('users', {",
      "  id: text('id').primaryKey(),",
      "  name: text('name').notNull(),",
      "  email: text('email').notNull().unique(),",
      "  createdAt: integer('created_at', { mode: 'timestamp' })",
      '    .notNull()',
      '    .$defaultFn(() => new Date()),',
      '});',
      '',
      'export type User = typeof users.$inferSelect;',
      'export type NewUser = typeof users.$inferInsert;',
      '',
    ].join('\n');
  } else if (dialect === 'mysql') {
    schemaContent = [
      "import { mysqlTable, varchar, timestamp } from 'drizzle-orm/mysql-core';",
      '',
      "export const users = mysqlTable('users', {",
      "  id: varchar('id', { length: 36 }).primaryKey(),",
      "  name: varchar('name', { length: 255 }).notNull(),",
      "  email: varchar('email', { length: 255 }).notNull().unique(),",
      "  createdAt: timestamp('created_at').defaultNow().notNull(),",
      '});',
      '',
      'export type User = typeof users.$inferSelect;',
      'export type NewUser = typeof users.$inferInsert;',
      '',
    ].join('\n');
  }

  await fsPromises.writeFile(
    path.join(schemaDir, 'index.ts'),
    schemaContent,
    'utf8',
  );

  // 8. Generate src/index.ts client connection
  let indexContent = '';
  if (dialect === 'postgresql') {
    indexContent = [
      "import { drizzle } from 'drizzle-orm/postgres-js';",
      "import postgres from 'postgres';",
      "import * as schema from './schema/index.js';",
      '',
      'const connectionString =',
      '  process.env.DATABASE_URL ||',
      "  'postgres://postgres:postgres@localhost:5432/morax_db';",
      '',
      '// Disable prefetch as it is not supported for "Transaction" pool mode',
      'const client = postgres(connectionString, { prepare: false });',
      'export const db = drizzle(client, { schema });',
      '',
      "export * from './schema/index.js';",
      '',
    ].join('\n');
  } else if (dialect === 'sqlite') {
    indexContent = [
      "import { drizzle } from 'drizzle-orm/libsql';",
      "import { createClient } from '@libsql/client';",
      "import * as schema from './schema/index.js';",
      '',
      'const client = createClient({',
      "  url: process.env.DATABASE_URL || 'file:local.db',",
      '  authToken: process.env.DATABASE_AUTH_TOKEN,',
      '});',
      '',
      'export const db = drizzle(client, { schema });',
      '',
      "export * from './schema/index.js';",
      '',
    ].join('\n');
  } else if (dialect === 'mysql') {
    indexContent = [
      "import { drizzle } from 'drizzle-orm/mysql2';",
      "import mysql from 'mysql2/promise';",
      "import * as schema from './schema/index.js';",
      '',
      'const pool = mysql.createPool(',
      '  process.env.DATABASE_URL ||',
      "    'mysql://root:password@localhost:3306/morax_db',",
      ');',
      '',
      "export const db = drizzle(pool, { schema, mode: 'default' });",
      '',
      "export * from './schema/index.js';",
      '',
    ].join('\n');
  }

  await fsPromises.writeFile(
    path.join(srcDir, 'index.ts'),
    indexContent,
    'utf8',
  );

  // 9. Generate .env and .env.example
  let envContent = '';
  if (dialect === 'postgresql') {
    envContent =
      'DATABASE_URL="postgres://postgres:postgres@localhost:5432/morax_db"\n';
  } else if (dialect === 'sqlite') {
    envContent = 'DATABASE_URL="file:local.db"\nDATABASE_AUTH_TOKEN=""\n';
  } else if (dialect === 'mysql') {
    envContent =
      'DATABASE_URL="mysql://root:password@localhost:3306/morax_db"\n';
  }

  await fsPromises.writeFile(
    path.join(dbDir, '.env.example'),
    envContent,
    'utf8',
  );
  await fsPromises.writeFile(path.join(dbDir, '.env'), envContent, 'utf8');

  // 10. Generate .gitignore
  const gitignoreContent = [
    'node_modules/',
    'dist/',
    '.env',
    '.env.local',
    '*.db',
    '*.db-journal',
    '',
  ].join('\n');
  await fsPromises.writeFile(
    path.join(dbDir, '.gitignore'),
    gitignoreContent,
    'utf8',
  );

  // 11. Generate README.md
  const readmeContent = [
    '# @repo/db',
    '',
    'Shared database layer powered by **Drizzle ORM**.',
    '',
    '## Available Scripts',
    '',
    '- `pnpm db:generate` — Generate SQL migrations based on schema changes.',
    '- `pnpm db:push` — Push schema directly to the database without generating migrations.',
    '- `pnpm db:migrate` — Apply generated migrations to the database.',
    '- `pnpm db:studio` — Open Drizzle Studio visual browser for inspecting and editing data.',
    '- `pnpm db:check` — Check migration history and verify consistency.',
    '',
  ].join('\n');
  await fsPromises.writeFile(
    path.join(dbDir, 'README.md'),
    readmeContent,
    'utf8',
  );
}

export async function runDrizzleSetup(
  projectPath: string,
  dialect: string = 'postgresql',
  linter: string = 'none',
) {
  const packagesDir = path.join(projectPath, 'packages');
  try {
    await fsPromises.access(packagesDir);
  } catch {
    return;
  }

  const s = spinner();
  console.log('\n');
  s.start('Setting up modular Drizzle ORM in packages/db...');
  try {
    await setupDrizzle(projectPath, dialect, linter);
    s.stop(
      pc.green('✔ Success: Modular Drizzle ORM configured in packages/db'),
    );
  } catch (error: any) {
    s.stop(pc.red('✖ Failed: Drizzle ORM setup failed'));
    console.error(pc.red(`\nError details: ${error.message || error}`));
    process.exit(1);
  }
  console.log('\n');
}
