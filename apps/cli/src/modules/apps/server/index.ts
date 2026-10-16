import { confirm, spinner } from '@clack/prompts';
import pc from 'picocolors';
import handleCancel from '../../../utils/isCancel.js';
import fsPromises from 'fs/promises';
import path from 'path';
import { runCommand } from '../../../utils/exec.js';
import type { ServerRuntime } from '../../../types/index.js';

export async function promptServer() {
  return await confirm({
    message: 'Do you want to setup an Express backend in apps/server?',
    initialValue: true,
  });
}

export async function setupServer(
  projectPath: string,
  linter: string = 'none',
  orm: 'drizzle' | 'none' = 'none',
  runtime: ServerRuntime = 'node',
) {
  const serverDir = path.join(projectPath, 'apps', 'server');
  const srcDir = path.join(serverDir, 'src');
  const hasDb = orm !== 'none';

  // 1. Create directory structure apps/server/src recursively
  await fsPromises.mkdir(srcDir, { recursive: true });

  // 2. Initialize package.json using pnpm init
  await runCommand('pnpm init', { cwd: serverDir, silent: true });

  // 3. Customize apps/server/package.json
  const serverPackagePath = path.join(serverDir, 'package.json');
  const serverPackageRaw = await fsPromises.readFile(serverPackagePath, 'utf8');
  const serverPkg = JSON.parse(serverPackageRaw);

  serverPkg.name = 'server';
  serverPkg.version = '1.0.0';
  serverPkg.private = true;
  serverPkg.type = 'module';
  serverPkg.main = 'dist/index.js';
  serverPkg.scripts = {
    dev:
      runtime === 'bun' ? 'bun --watch src/index.ts' : 'tsx watch src/index.ts',
    build: 'tsdown',
    start: runtime === 'bun' ? 'bun dist/index.js' : 'node dist/index.js',
    check: 'tsc --noEmit',
  };

  if (linter === 'biome') {
    serverPkg.scripts.lint = 'biome lint .';
  } else if (linter === 'oxlint') {
    serverPkg.scripts.lint = 'oxlint .';
  }

  serverPkg.devDependencies = {
    '@config/typescript': 'workspace:*',
  };

  if (hasDb) {
    serverPkg.dependencies = {
      ...(serverPkg.dependencies || {}),
      '@repo/db': 'workspace:*',
    };
  }

  // Remove defaults that are not needed
  delete serverPkg.keywords;
  delete serverPkg.author;
  delete serverPkg.license;

  await fsPromises.writeFile(
    serverPackagePath,
    JSON.stringify(serverPkg, null, 2),
    'utf8',
  );

  // 4. Create tsconfig.json extending the base shared config
  const tsconfigContent = {
    extends: '@config/typescript/tsconfig.json',
    compilerOptions: {
      rootDir: 'src',
      outDir: 'dist',
    },
    include: ['src/**/*'],
  };

  await fsPromises.writeFile(
    path.join(serverDir, 'tsconfig.json'),
    JSON.stringify(tsconfigContent, null, 2),
    'utf8',
  );

  // 5. Create tsdown.config.ts for fast, modern Rolldown-powered builds
  const tsdownConfigContent = [
    "import { defineConfig } from 'tsdown';",
    '',
    'export default defineConfig({',
    "  entry: ['./src/index.ts'],",
    "  format: 'esm',",
    "  platform: 'node',",
    '  clean: true,',
    '});',
    '',
  ].join('\n');

  await fsPromises.writeFile(
    path.join(serverDir, 'tsdown.config.ts'),
    tsdownConfigContent,
    'utf8',
  );

  // 6. Install dependencies dynamically using pnpm add (fetches latest)
  await runCommand('pnpm add express cors', { cwd: serverDir, silent: false });

  const devDependencies = [
    '@types/express',
    '@types/cors',
    'tsdown',
    'typescript@latest',
  ];

  if (runtime === 'bun') {
    devDependencies.push('@types/bun');
  } else {
    devDependencies.push('@types/node', 'tsx');
  }

  await runCommand(`pnpm add -D ${devDependencies.join(' ')}`, {
    cwd: serverDir,
    silent: false,
  });

  // 7. Create src/index.ts with starter code using CORS and Express
  let dbImport: string[] = [];
  let dbRoute: string[] = [];

  if (orm === 'drizzle') {
    dbImport = ["import { db, users } from '@repo/db';"];
    dbRoute = [
      '// Example endpoint querying shared database package (Drizzle ORM)',
      "app.get('/api/users', async (req, res) => {",
      '  try {',
      '    const allUsers = await db.select().from(users);',
      '    res.json({ users: allUsers });',
      '  } catch (error: any) {',
      '    res.status(500).json({ error: error.message });',
      '  }',
      '});',
      '',
    ];
  }

  const indexTsContent = [
    "import express from 'express';",
    "import cors from 'cors';",
    ...dbImport,
    '',
    'const app = express();',
    'const port = process.env.PORT || 3001;',
    '',
    '// Enable CORS and parsing of JSON request bodies',
    'app.use(cors());',
    'app.use(express.json());',
    '',
    '// Root API health and welcome route',
    "app.get('/api', (req, res) => {",
    '  res.json({',
    "    message: 'Welcome to the Morax High-Performance Backend API!',",
    '    timestamp: new Date().toISOString(),',
    "    status: 'healthy',",
    '  });',
    '});',
    '',
    ...dbRoute,
    'app.listen(port, () => {',
    '  console.log(`🚀 Server is running on http://localhost:${port}`);',
    '});',
    '',
  ].join('\n');

  await fsPromises.writeFile(
    path.join(srcDir, 'index.ts'),
    indexTsContent,
    'utf8',
  );
}

export async function runServerSetup(
  projectPath: string,
  linter: string = 'none',
  orm: 'drizzle' | 'none' = 'none',
  runtime: ServerRuntime = 'node',
) {
  // Ensure the apps folder option was generated/exists
  const appsDir = path.join(projectPath, 'apps');
  try {
    await fsPromises.access(appsDir);
  } catch {
    // If the apps folder was not scaffolded, we shouldn't attempt to setup Server there
    return;
  }

  const runtimeLabel = runtime === 'bun' ? 'Bun' : 'Node.js';
  const s = spinner();
  s.start(
    `Setting up modular Express backend (${runtimeLabel}) in apps/server...`,
  );
  try {
    await setupServer(projectPath, linter, orm, runtime);
    s.stop(
      pc.green(
        `✔ Success: Modular Express backend (${runtimeLabel}) configured in apps/server`,
      ),
    );
  } catch (error: any) {
    s.stop(pc.red('✖ Failed: Express backend setup failed'));
    console.error(pc.red(`\nError details: ${error.message || error}`));
    process.exit(1);
  }
}
