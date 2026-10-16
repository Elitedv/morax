import { spinner } from '@clack/prompts';
import pc from 'picocolors';
import fsPromises from 'fs/promises';
import path from 'path';
import { runCommand } from '../../utils/exec.js';

export interface BiomeOptions {
  linter: boolean;
  formatter: boolean;
}

export async function setupBiome(projectPath: string, options: BiomeOptions) {
  // 1. Install @biomejs/biome dynamically at the workspace root
  await runCommand('pnpm add -D -E @biomejs/biome -w', {
    cwd: projectPath,
    silent: true,
  });

  // 2. Author modern Biome 2.x biome.json with selected capabilities enabled/disabled
  const biomeConfig = {
    $schema: 'https://biomejs.dev/schemas/2.5.15/schema.json',
    vcs: {
      enabled: true,
      clientKind: 'git',
      useIgnoreFile: true,
    },
    files: {
      ignoreUnknown: false,
      includes: ['**'],
    },
    formatter: {
      enabled: options.formatter,
      indentStyle: 'space',
      lineWidth: 100,
    },
    linter: {
      enabled: options.linter,
      rules: {
        preset: 'recommended',
      },
    },
  };

  await fsPromises.writeFile(
    path.join(projectPath, 'biome.json'),
    JSON.stringify(biomeConfig, null, 2),
    'utf8',
  );

  // Run biome migrate --write to auto-align schema with the exact installed version
  try {
    await runCommand('pnpm exec biome migrate --write', {
      cwd: projectPath,
      silent: true,
    });
  } catch {}

  // 3. Inject root scripts into package.json
  const rootPackagePath = path.join(projectPath, 'package.json');
  const rootPackageRaw = await fsPromises.readFile(rootPackagePath, 'utf8');
  const rootPkg = JSON.parse(rootPackageRaw);
  rootPkg.scripts = rootPkg.scripts || {};

  if (options.linter) {
    rootPkg.scripts.lint = 'biome lint .';
  }
  if (options.formatter) {
    rootPkg.scripts.format = 'biome format --write .';
    rootPkg.scripts['format:check'] = 'biome format .';
  }
  if (options.linter && options.formatter) {
    rootPkg.scripts.check = 'biome check --write .';
  }

  await fsPromises.writeFile(
    rootPackagePath,
    JSON.stringify(rootPkg, null, 2),
    'utf8',
  );
}

export async function runBiomeSetup(
  projectPath: string,
  options: BiomeOptions,
) {
  const s = spinner();

  const actionText =
    options.linter && options.formatter
      ? 'linter & formatter'
      : options.linter
        ? 'linter'
        : 'formatter';

  s.start(`Configuring ultra-fast Biome ${actionText}...`);
  try {
    await setupBiome(projectPath, options);
    s.stop(pc.green(`✔ Success: Biome ${actionText} configured successfully`));
  } catch (error: any) {
    s.stop(pc.red(`✖ Failed: Biome setup failed`));
    console.error(pc.red(`\nError details: ${error.message || error}`));
    process.exit(1);
  }
}
