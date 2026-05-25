import { confirm, spinner } from '@clack/prompts';
import pc from 'picocolors';
import handleCancel from '../utils/isCancel.js';
import fsPromises from 'fs/promises';
import path from 'path';
import { runCommand } from '../utils/exec.js';

export async function promptServer() {
  return await confirm({
    message: 'Do you want to setup a basic Express backend in apps/server?',
    initialValue: true,
  });
}

export async function setupServer(projectPath: string) {
  const serverDir = path.join(projectPath, 'apps', 'server');
  const srcDir = path.join(serverDir, 'src');

  // 1. Create directory structure apps/server/src recursively
  await fsPromises.mkdir(srcDir, { recursive: true });

  // 2. Initialize package.json using pnpm init
  await runCommand('pnpm init', { cwd: serverDir, silent: true });

  // 3. Customize apps/server/package.json
  const serverPackagePath = path.join(serverDir, 'package.json');
  const serverPackageRaw = await fsPromises.readFile(serverPackagePath, 'utf8');
  const serverPkg = JSON.parse(serverPackageRaw);

  // Check if modular ESLint package exists in workspace packages
  const eslintDir = path.join(projectPath, 'packages', 'eslint');
  let hasEslint = false;
  try {
    await fsPromises.access(eslintDir);
    hasEslint = true;
  } catch {}

  serverPkg.name = 'server';
  serverPkg.version = '1.0.0';
  serverPkg.private = true;
  serverPkg.type = 'module';
  serverPkg.main = 'dist/index.js';
  serverPkg.scripts = {
    dev: 'tsx watch src/index.ts',
    build: 'tsc',
    start: 'node dist/index.js',
  };
  serverPkg.devDependencies = {
    '@config/typescript': 'workspace:*',
  };

  if (hasEslint) {
    serverPkg.devDependencies['@config/eslint'] = 'workspace:*';
    serverPkg.scripts['lint'] = 'eslint .';
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

  // If ESLint exists, write the server's eslint.config.ts extending the base config
  if (hasEslint) {
    const eslintConfigContent = [
      "import baseConfig from '@config/eslint';",
      '',
      'export default [',
      '  ...baseConfig,',
      '  {',
      '    // Add server-specific overrides if necessary',
      '  },',
      '];',
      '',
    ].join('\n');

    await fsPromises.writeFile(
      path.join(serverDir, 'eslint.config.ts'),
      eslintConfigContent,
      'utf8',
    );
  }

  // 5. Install dependencies dynamically using pnpm add (fetches latest)
  await runCommand('pnpm add express cors', { cwd: serverDir, silent: false });
  await runCommand('pnpm add -D @types/express @types/cors tsx typescript', {
    cwd: serverDir,
    silent: false,
  });

  // 6. Create src/index.ts with premium starter code using CORS and Express
  const indexTsContent = [
    "import express from 'express';",
    "import cors from 'cors';",
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

export async function runServerSetup(projectPath: string) {
  // Ensure the apps folder option was generated/exists
  const appsDir = path.join(projectPath, 'apps');
  try {
    await fsPromises.access(appsDir);
  } catch {
    // If the apps folder was not scaffolded, we shouldn't attempt to setup Server there
    return;
  }

  const serverPrompt = await promptServer();

  handleCancel(serverPrompt);

  if (serverPrompt) {
    const s = spinner();
    console.log('\n');
    s.start('Setting up modular Express backend in apps/server...');
    try {
      await setupServer(projectPath);
      s.stop(
        pc.green(
          '✔ Success: Modular Express backend configured in apps/server',
        ),
      );
    } catch (error: any) {
      s.stop(pc.red('✖ Failed: Express backend setup failed'));
      console.error(pc.red(`\nError details: ${error.message || error}`));
      process.exit(1);
    }
    console.log('\n');
  }
}
