import { multiselect, spinner } from '@clack/prompts';
import fsPromises from 'fs/promises';
import path from 'path';
import pc from 'picocolors';
import handleCancel from '../utils/isCancel.js';
import { generateWorkspaceConfig } from './workspace.js';

export async function createDirectories(
  directories: ('apps' | 'packages')[],
  projectPath: string,
) {
  for (const dir of directories) {
    const dirPath = path.join(projectPath, dir);
    await fsPromises.mkdir(dirPath, { recursive: true });
    await fsPromises.writeFile(
      path.join(dirPath, '.gitkeep'),
      `# Placeholder to ensure git tracks the empty ${dir}/ folder\n`,
      'utf8',
    );
  }
}

export async function makeDirectories(name: string, projectPath: string) {
  const directories = await multiselect({
    message: 'Which directories do you want to include in your workspace?',
    options: [
      {
        value: 'apps',
        label: 'apps/*',
        hint: 'For frontend apps and backend services',
      },
      {
        value: 'packages',
        label: 'packages/*',
        hint: 'For shared components, configs, and utilities',
      },
    ],
    required: true,
  });

  handleCancel(directories);

  const s = spinner();
  console.log('\n');
  s.start('Generating workspace configs...');
  try {
    await generateWorkspaceConfig(
      name,
      directories as ('apps' | 'packages')[],
      projectPath,
    );
    await createDirectories(
      directories as ('apps' | 'packages')[],
      projectPath,
    );
    s.stop(pc.green('✔ Success: Generated Workspace Root & Folder Structures'));
  } catch (error: any) {
    s.stop(pc.red('✖ Failed: Workspace generation failed'));
    console.error(pc.red(`\nError details: ${error.message || error}`));
    process.exit(1);
  }
  console.log('\n');

  return directories;
}
