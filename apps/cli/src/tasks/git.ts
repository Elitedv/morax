import fsPromises from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function gitInit(projectPath: string) {
  // 1. Initialize empty git repository
  await execAsync('git init', { cwd: projectPath });

  // 2. Create high-quality standard .gitignore
  const gitignore = [
    '# Dependency directories',
    'node_modules/',
    'jspm_packages/',
    'web_modules/',
    '',
    '# Build and output outputs',
    'dist/',
    'build/',
    '.next/',
    'out/',
    '.turbo/',
    '',
    '# Environments',
    '.env',
    '.env.local',
    '.env.development.local',
    '.env.test.local',
    '.env.production.local',
    '',
    '# Logs',
    'npm-debug.log*',
    'yarn-debug.log*',
    'yarn-error.log*',
    'pnpm-debug.log*',
    '*.log',
    '',
    '# OS Metadata',
    '.DS_Store',
    'Thumbs.db',
    '',
  ].join('\n');

  await fsPromises.writeFile(
    path.join(projectPath, '.gitignore'),
    gitignore,
    'utf8',
  );
}
