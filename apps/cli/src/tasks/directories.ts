import fsPromises from 'fs/promises';
import path from 'path';

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
