import { select, spinner } from '@clack/prompts';
import pc from 'picocolors';
import handleCancel from '../utils/isCancel.js';
import fsPromises from 'fs/promises';
import path from 'path';
import { runCommand } from '../utils/exec.js';

export async function promptPrisma(): Promise<string> {
  const dbChoice = await select({
    message: 'Which database would you like to use with Prisma?',
    options: [
      {
        value: 'postgresql',
        label: 'PostgreSQL',
        hint: 'Recommended relational database (Supabase, Neon, Docker)',
      },
      {
        value: 'mongodb',
        label: 'MongoDB',
        hint: 'Document database (MongoDB Atlas or local)',
      },
    ],
    initialValue: 'postgresql',
  });

  handleCancel(dbChoice);
  return dbChoice as string;
}

export async function setupPrisma(
  projectPath: string,
  dialect: 'postgresql' | 'mongodb' = 'postgresql',
  linter: string = 'none',
) {
  const dbDir = path.join(projectPath, 'packages', 'db');
  const srcDir = path.join(dbDir, 'src');
  const prismaDir = path.join(dbDir, 'prisma');

  // 1. Create directory structure packages/db/src and packages/db/prisma recursively
  await fsPromises.mkdir(srcDir, { recursive: true });
  await fsPromises.mkdir(prismaDir, { recursive: true });

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
  };

  dbPkg.scripts = {
    build: 'tsc',
    'db:generate': 'prisma generate',
    'db:push': 'prisma db push',
    'db:studio': 'prisma studio',
  };

  if (dialect === 'postgresql') {
    dbPkg.scripts['db:migrate'] = 'prisma migrate dev';
  }

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
    include: ['src/**/*'],
  };

  await fsPromises.writeFile(
    path.join(dbDir, 'tsconfig.json'),
    JSON.stringify(tsconfigContent, null, 2),
    'utf8',
  );

  // 5. Install dependencies dynamically using pnpm add (fetches latest)
  await runCommand('pnpm add @prisma/client dotenv', {
    cwd: dbDir,
    silent: false,
  });

  await runCommand(
    'pnpm add -D prisma@latest @types/node tsx typescript@latest',
    {
      cwd: dbDir,
      silent: false,
    },
  );

  // 6. Generate prisma/schema.prisma based on chosen provider
  let schemaContent = '';
  if (dialect === 'postgresql') {
    schemaContent = [
      'generator client {',
      '  provider = "prisma-client-js"',
      '}',
      '',
      'datasource db {',
      '  provider = "postgresql"',
      '  url      = env("DATABASE_URL")',
      '}',
      '',
      'model User {',
      '  id        String   @id @default(uuid())',
      '  email     String   @unique',
      '  name      String?',
      '  createdAt DateTime @default(now())',
      '  updatedAt DateTime @updatedAt',
      '}',
      '',
    ].join('\n');
  } else if (dialect === 'mongodb') {
    schemaContent = [
      'generator client {',
      '  provider = "prisma-client-js"',
      '}',
      '',
      'datasource db {',
      '  provider = "mongodb"',
      '  url      = env("DATABASE_URL")',
      '}',
      '',
      'model User {',
      '  id        String   @id @default(auto()) @map("_id") @db.ObjectId',
      '  email     String   @unique',
      '  name      String?',
      '  createdAt DateTime @default(now())',
      '  updatedAt DateTime @updatedAt',
      '}',
      '',
    ].join('\n');
  }

  await fsPromises.writeFile(
    path.join(prismaDir, 'schema.prisma'),
    schemaContent,
    'utf8',
  );

  // 7. Generate src/index.ts with singleton pattern
  const indexContent = [
    "import { PrismaClient } from '@prisma/client';",
    '',
    'const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };',
    '',
    'export const db =',
    '  globalForPrisma.prisma ||',
    '  new PrismaClient({',
    '    log:',
    "      process.env.NODE_ENV === 'development'",
    "        ? ['query', 'error', 'warn']",
    "        : ['error'],",
    '  });',
    '',
    "if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;",
    '',
    "export * from '@prisma/client';",
    '',
  ].join('\n');

  await fsPromises.writeFile(
    path.join(srcDir, 'index.ts'),
    indexContent,
    'utf8',
  );

  // 8. Generate .env and .env.example
  let envContent = '';
  if (dialect === 'postgresql') {
    envContent =
      'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/morax_db?schema=public"\n';
  } else if (dialect === 'mongodb') {
    envContent =
      'DATABASE_URL="mongodb://localhost:27017/morax_db?directConnection=true"\n';
  }

  await fsPromises.writeFile(
    path.join(dbDir, '.env.example'),
    envContent,
    'utf8',
  );
  await fsPromises.writeFile(path.join(dbDir, '.env'), envContent, 'utf8');

  // 9. Generate .gitignore
  const gitignoreContent = [
    'node_modules/',
    'dist/',
    '.env',
    '.env.local',
    '',
  ].join('\n');
  await fsPromises.writeFile(
    path.join(dbDir, '.gitignore'),
    gitignoreContent,
    'utf8',
  );

  // 10. Generate README.md
  const readmeContent = [
    '# @repo/db',
    '',
    'Shared database layer powered by **Prisma ORM**.',
    '',
    '## Available Scripts',
    '',
    '- `pnpm db:generate` — Generate the Prisma Client from `schema.prisma`.',
    '- `pnpm db:push` — Push schema state directly to the database without generating migrations.',
    ...(dialect === 'postgresql'
      ? [
          '- `pnpm db:migrate` — Create and apply SQL migrations to the database.',
        ]
      : []),
    '- `pnpm db:studio` — Open Prisma Studio visual GUI to explore and edit data.',
    '',
  ].join('\n');
  await fsPromises.writeFile(
    path.join(dbDir, 'README.md'),
    readmeContent,
    'utf8',
  );

  // 11. Run initial prisma generate to initialize client types
  try {
    await runCommand('pnpm prisma generate', { cwd: dbDir, silent: true });
  } catch {}
}

export async function runPrismaSetup(
  projectPath: string,
  dialect: 'postgresql' | 'mongodb' = 'postgresql',
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
  s.start('Setting up modular Prisma ORM in packages/db...');
  try {
    await setupPrisma(projectPath, dialect, linter);
    s.stop(pc.green('✔ Success: Modular Prisma ORM configured in packages/db'));
  } catch (error: any) {
    s.stop(pc.red('✖ Failed: Prisma ORM setup failed'));
    console.error(pc.red(`\nError details: ${error.message || error}`));
    process.exit(1);
  }
  console.log('\n');
}
