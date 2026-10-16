import { select, spinner } from '@clack/prompts';
import pc from 'picocolors';
import handleCancel from '../../../utils/isCancel.js';
import fsPromises from 'fs/promises';
import path from 'path';
import { runCommand } from '../../../utils/exec.js';

export async function promptDrizzle(): Promise<string> {
  const dialectChoice = await select({
    message: 'Which database dialect would you like to use with Drizzle?',
    options: [
      {
        value: 'postgresql',
        label: 'PostgreSQL',
        hint: 'node-postgres / Pool / Neon / Supabase / Docker',
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
  const seedDir = path.join(srcDir, 'seed');

  // 1. Create directory structure packages/db/src/{schema,seed} recursively
  await fsPromises.mkdir(schemaDir, { recursive: true });
  await fsPromises.mkdir(seedDir, { recursive: true });

  // 2. Initialize package.json using pnpm init
  await runCommand('pnpm init', { cwd: dbDir, silent: true });

  // 3. Customize packages/db/package.json
  const dbPackagePath = path.join(dbDir, 'package.json');
  const dbPackageRaw = await fsPromises.readFile(dbPackagePath, 'utf8');
  const dbPkg = JSON.parse(dbPackageRaw);

  dbPkg.name = '@repo/db';
  dbPkg.version = '1.0.0';
  dbPkg.description = 'Shared Drizzle ORM database layer';
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
    'db:seed': 'tsx src/seed/seed.ts',
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

  // 4. Create tsconfig.json matching rootDir: . and node types for drizzle.config.ts
  const tsconfigContent = {
    extends: '@config/typescript/tsconfig.json',
    compilerOptions: {
      rootDir: '.',
      outDir: 'dist',
      declaration: true,
      types: ['node'],
    },
    include: ['src/**/*', 'drizzle.config.ts'],
  };

  await fsPromises.writeFile(
    path.join(dbDir, 'tsconfig.json'),
    JSON.stringify(tsconfigContent, null, 2),
    'utf8',
  );

  // 5. Install dependencies dynamically using pnpm add (using @rc for latest Drizzle)
  await runCommand('pnpm add drizzle-orm@rc pg dotenv @types/pg', {
    cwd: dbDir,
    silent: false,
  });

  await runCommand(
    'pnpm add -D drizzle-kit@rc @types/node tsx typescript@latest',
    {
      cwd: dbDir,
      silent: false,
    },
  );

  // 6. Generate drizzle.config.ts with package-relative .env loading
  const drizzleConfigContent = [
    "import { config } from 'dotenv';",
    "import { defineConfig } from 'drizzle-kit';",
    "import path from 'node:path';",
    "import { fileURLToPath } from 'node:url';",
    '',
    'const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)));',
    "config({ path: path.join(packageRoot, '.env'), override: true });",
    '',
    'export default defineConfig({',
    "  out: './drizzle',",
    "  schema: './src/schema/index.ts',",
    "  dialect: 'postgresql',",
    '  dbCredentials: {',
    "    url: process.env.DATABASE_URL || 'postgresql://morax:morax@127.0.0.1:5432/morax_db',",
    '  },',
    '});',
    '',
  ].join('\n');

  await fsPromises.writeFile(
    path.join(dbDir, 'drizzle.config.ts'),
    drizzleConfigContent,
    'utf8',
  );

  // 7. Generate src/schema/index.ts with PostgreSQL starter schemas and types
  const schemaContent = [
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

  await fsPromises.writeFile(
    path.join(schemaDir, 'index.ts'),
    schemaContent,
    'utf8',
  );

  // 8. Generate src/client.ts with explicit connection pool and schema
  const clientContent = [
    "import { config } from 'dotenv';",
    "import path from 'node:path';",
    "import { fileURLToPath } from 'node:url';",
    "import { drizzle } from 'drizzle-orm/node-postgres';",
    "import { Pool } from 'pg';",
    "import * as schema from './schema/index.js';",
    '',
    "const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');",
    "config({ path: path.join(packageRoot, '.env') });",
    '',
    'const connectionString =',
    '  process.env.DATABASE_URL ||',
    "  'postgresql://morax:morax@127.0.0.1:5432/morax_db';",
    '',
    'export const pool = new Pool({',
    '  connectionString,',
    '});',
    '',
    'export const db = drizzle({ client: pool, schema });',
    'export type Database = typeof db;',
    '',
  ].join('\n');

  await fsPromises.writeFile(
    path.join(srcDir, 'client.ts'),
    clientContent,
    'utf8',
  );

  // 9. Generate src/index.ts re-exporting client, schema, and drizzle-orm
  const indexContent = [
    "export { db, pool, type Database } from './client.js';",
    "export * from './schema/index.js';",
    "export * from 'drizzle-orm';",
    '',
  ].join('\n');

  await fsPromises.writeFile(
    path.join(srcDir, 'index.ts'),
    indexContent,
    'utf8',
  );

  // 10. Generate src/seed/seed.ts and src/seed/index.ts
  const seedScriptContent = [
    "import { pool, db } from '../client.js';",
    "import { users } from '../schema/index.js';",
    '',
    '/**',
    ' * Starter database seeder',
    ' */',
    'export async function seed() {',
    "  console.log('🌱 [Seed] Starting database seeding...\\n');",
    '',
    '  try {',
    "    console.log('👥 [Seed] Seeding sample user...');",
    '    await db',
    '      .insert(users)',
    '      .values({',
    "        name: 'Demo User',",
    "        email: 'demo@example.com',",
    '      })',
    '      .onConflictDoNothing();',
    '',
    "    console.log('🎉 [Seed] Seeding completed successfully!\\n');",
    '  } catch (error) {',
    "    console.error('❌ [Seed] Error occurred during database seeding:', error);",
    '    process.exitCode = 1;',
    '  } finally {',
    '    await pool.end();',
    '  }',
    '}',
    '',
    '// Execute seed script if run directly',
    'seed().catch((err) => {',
    "  console.error('Fatal seed error:', err);",
    '  process.exit(1);',
    '});',
    '',
  ].join('\n');

  await fsPromises.writeFile(
    path.join(seedDir, 'seed.ts'),
    seedScriptContent,
    'utf8',
  );

  const seedIndexContent = ["export { seed } from './seed.js';", ''].join('\n');
  await fsPromises.writeFile(
    path.join(seedDir, 'index.ts'),
    seedIndexContent,
    'utf8',
  );

  // 11. Generate .env and .env.example
  const envContent = [
    'POSTGRES_HOST=127.0.0.1',
    'POSTGRES_USER=morax',
    'POSTGRES_PASSWORD=morax',
    'POSTGRES_DB=morax_db',
    'POSTGRES_PORT=5432',
    'DATABASE_URL=postgresql://morax:morax@127.0.0.1:5432/morax_db',
    '',
  ].join('\n');

  await fsPromises.writeFile(
    path.join(dbDir, '.env.example'),
    envContent,
    'utf8',
  );
  await fsPromises.writeFile(path.join(dbDir, '.env'), envContent, 'utf8');

  // 12. Generate .gitignore
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

  // 13. Generate README.md
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
    '- `pnpm db:seed` — Seed starter database records.',
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
}
