import { spinner } from '@clack/prompts';
import pc from 'picocolors';
import fsPromises from 'fs/promises';
import path from 'path';
import { runCommand } from '../../utils/exec.js';

export async function setupLefthook(
  projectPath: string,
  hasFormatter: boolean,
  hasLinter: boolean,
) {
  // 1. Install lefthook dynamically at workspace root
  await runCommand('pnpm add -D lefthook -w', {
    cwd: projectPath,
    silent: true,
  });

  // 2. Configure lefthook.yml dynamically
  const commands: string[] = [];

  if (hasFormatter) {
    commands.push('    format:');
    commands.push(
      '      glob: "*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc,css}"',
    );
    commands.push('      run: pnpm format && git add {staged_files}');
  }

  if (hasLinter) {
    commands.push('    lint:');
    commands.push('      glob: "*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx}"');
    commands.push('      run: pnpm lint');
  }

  if (commands.length === 0) {
    // Fallback if neither was selected
    commands.push('    check:');
    commands.push('      run: git status');
  }

  const lefthookConfig = [
    'pre-commit:',
    '  parallel: false',
    '  commands:',
    ...commands,
    '',
  ].join('\n');

  await fsPromises.writeFile(
    path.join(projectPath, 'lefthook.yml'),
    lefthookConfig,
    'utf8',
  );

  // 3. Inject prepare script in root package.json
  const rootPackagePath = path.join(projectPath, 'package.json');
  const rootPackageRaw = await fsPromises.readFile(rootPackagePath, 'utf8');
  const rootPkg = JSON.parse(rootPackageRaw);
  rootPkg.scripts = rootPkg.scripts || {};
  rootPkg.scripts.prepare = 'lefthook install';

  await fsPromises.writeFile(
    rootPackagePath,
    JSON.stringify(rootPkg, null, 2),
    'utf8',
  );

  // 4. Initialize lefthook
  await runCommand('pnpm exec lefthook install', {
    cwd: projectPath,
    silent: true,
  });
}

export async function runLefthookSetup(
  projectPath: string,
  gitInitialized: boolean,
  hasFormatter: boolean,
  hasLinter: boolean,
) {
  if (!gitInitialized) return;

  const s = spinner();
  s.start('Configuring modern Lefthook Git hooks...');
  try {
    await setupLefthook(projectPath, hasFormatter, hasLinter);
    s.stop(pc.green('✔ Success: Lefthook Git hooks configured'));
  } catch (error: any) {
    s.stop(pc.red('✖ Failed: Lefthook setup failed'));
    console.error(pc.red(`\nError details: ${error.message || error}`));
    process.exit(1);
  }
}
