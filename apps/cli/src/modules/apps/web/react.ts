import pc from 'picocolors';
import fsPromises from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';
import { confirm, spinner, text } from '@clack/prompts';
import handleCancel from '../../../utils/isCancel.js';
import { runCommand } from '../../../utils/exec.js';

function runInteractiveCommand(
  command: string,
  args: string[],
  cwd: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const fullCommand =
      args.length > 0 ? `${command} ${args.join(' ')}` : command;
    const child = spawn(fullCommand, [], {
      cwd,
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, NODE_NO_WARNINGS: '1' },
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(
          new Error(
            `Command "${command} ${args.join(' ')}" exited with code ${code}`,
          ),
        );
      }
    });

    child.on('error', (err) => {
      reject(err);
    });
  });
}

export async function setupReact(projectPath: string, isMonorepo = true) {
  const appsDir = isMonorepo
    ? path.join(projectPath, 'apps')
    : path.dirname(projectPath);

  // 1. Print important warnings to prevent blocking
  console.log(pc.magentaBright('\n🔷 IMPORTANT INSTRUCTIONS:'));
  console.log(
    pc.magentaBright(
      'During the Vite interactive configuration prompts, please select:',
    ),
  );
  console.log(
    pc.magentaBright(
      `  1. Install & Start: Choose ${pc.bold('No')} when asked "Install with npm/pnpm and start now?"`,
    ),
  );
  console.log(
    pc.magentaBright(
      'This allows Morax CLI to continue automatically configuring your workspace (Oxlint, Prettier, Tailwind, packages, etc.)!',
    ),
  );

  // 2. Run pnpm create vite@latest interactively!
  console.log(
    pc.cyan('\nStarting interactive Vite React application setup...'),
  );

  // Get list of directories in appsDir before running Vite to auto-detect the chosen project name
  let beforeDirs: string[] = [];
  try {
    beforeDirs = await fsPromises.readdir(appsDir);
  } catch {}

  try {
    await runInteractiveCommand('pnpm', ['create', 'vite@latest'], appsDir);

    // Get list of directories in appsDir after running Vite
    let afterDirs: string[] = [];
    try {
      afterDirs = await fsPromises.readdir(appsDir);
    } catch {}

    // Find the newly created folder
    const newDirs = afterDirs.filter((d) => !beforeDirs.includes(d));
    let createdDirName = 'web'; // fallback
    if (newDirs.length > 0) {
      createdDirName = newDirs[0];
    }
    const webDir = path.join(appsDir, createdDirName);

    // Verify directory exists
    try {
      await fsPromises.access(webDir);
    } catch {
      throw new Error(
        `Vite React application directory "apps/${createdDirName}" was not found. Please ensure you complete the Vite installation.`,
      );
    }

    // Ensure that in a monorepo the web package name is always "web"
    const pkgPath = path.join(webDir, 'package.json');
    try {
      const pkgRaw = await fsPromises.readFile(pkgPath, 'utf8');
      const pkg = JSON.parse(pkgRaw);
      if (isMonorepo) {
        pkg.name = 'web';
      } else {
        pkg.pnpm = {
          ...(pkg.pnpm || {}),
          onlyBuiltDependencies: ['esbuild'],
        };
      }
      await fsPromises.writeFile(pkgPath, JSON.stringify(pkg, null, 2), 'utf8');
    } catch {}

    // Always configure Path Aliases & @types/node right away so import aliases are ready
    const aliasSpinner = spinner();
    aliasSpinner.start('Configuring import aliases and Node types...');
    try {
      // Install @types/node dynamically into devDependencies
      await runCommand('pnpm add -D @types/node', {
        cwd: webDir,
        silent: true,
      });

      // tsconfig.json / tsconfig.app.json
      const tsconfigPaths = [
        path.join(webDir, 'tsconfig.json'),
        path.join(webDir, 'tsconfig.app.json'),
      ];
      for (const tsPath of tsconfigPaths) {
        try {
          let content = await fsPromises.readFile(tsPath, 'utf8');
          if (content.includes('"compilerOptions"')) {
            if (!content.includes('"paths"')) {
              content = content.replace(
                /("compilerOptions"\s*:\s*\{)/,
                `$1\n    "baseUrl": ".",\n    "paths": {\n      "@/*": ["./src/*"]\n    },`,
              );
              await fsPromises.writeFile(tsPath, content, 'utf8');
            }
          } else {
            content = content.replace(
              /^(\s*\{)/,
              `$1\n  "compilerOptions": {\n    "baseUrl": ".",\n    "paths": {\n      "@/*": ["./src/*"]\n    }\n  },`,
            );
            await fsPromises.writeFile(tsPath, content, 'utf8');
          }
        } catch {}
      }

      // vite.config.ts
      const viteConfigPath = path.join(webDir, 'vite.config.ts');
      try {
        let content = await fsPromises.readFile(viteConfigPath, 'utf8');
        if (!content.includes("import path from 'path'")) {
          content = "import path from 'path';\n" + content;
        }
        if (!content.includes('resolve:')) {
          content = content.replace(
            /(plugins:\s*\[[^\]]*\]),?/,
            `$1,\n  resolve: {\n    alias: {\n      "@": path.resolve(import.meta.dirname, "./src"),\n    },\n  }`,
          );
        }
        await fsPromises.writeFile(viteConfigPath, content, 'utf8');
      } catch {}

      aliasSpinner.stop(
        pc.green('✔ Success: Import aliases and Node types configured'),
      );
    } catch (err: any) {
      aliasSpinner.stop(pc.red('✖ Failed: Import alias configuration failed'));
    }

    console.log(
      pc.green(
        isMonorepo
          ? `\n✔ Success: Vite React frontend configured in apps/${createdDirName}\n`
          : `\n✔ Success: Vite React frontend configured at root\n`,
      ),
    );

    // 3. Prompt for Tailwind CSS v4 and shadcn UI setup
    const setupTailwindPrompt = await confirm({
      message: 'Do you want to install and configure Tailwind CSS v4?',
      initialValue: true,
    });
    handleCancel(setupTailwindPrompt);

    const setupShadcnPrompt = await confirm({
      message: `Do you want to setup shadcn UI in your Vite React website (apps/${createdDirName})?`,
      initialValue: true,
    });
    handleCancel(setupShadcnPrompt);

    // Determine if Tailwind needs to be installed (shadcn UI requires Tailwind)
    const needsTailwind = setupTailwindPrompt || setupShadcnPrompt;

    if (needsTailwind) {
      const s = spinner();
      s.start(
        'Installing Tailwind CSS v4, Vite integration, and Node types...',
      );
      try {
        // 4. Install Tailwind CSS v4 and Vite integration dynamically using pnpm add
        await runCommand('pnpm add tailwindcss', {
          cwd: webDir,
          silent: true,
        });
        await runCommand('pnpm add -D @tailwindcss/vite', {
          cwd: webDir,
          silent: true,
        });

        s.message('Configuring Vite plugins and Tailwind CSS imports...');

        // 5. Configure the Vite plugin in vite.config.ts
        const viteConfigPath = path.join(webDir, 'vite.config.ts');
        try {
          let content = await fsPromises.readFile(viteConfigPath, 'utf8');

          // Check if React Compiler is present (from Vite 7 / create-vite option)
          const hasReactCompiler =
            content.includes('reactCompilerPreset') ||
            content.includes('@rolldown/plugin-babel') ||
            content.includes('babel({');

          if (hasReactCompiler) {
            content = [
              "import path from 'path';",
              "import tailwindcss from '@tailwindcss/vite';",
              "import react, { reactCompilerPreset } from '@vitejs/plugin-react';",
              "import babel from '@rolldown/plugin-babel';",
              "import { defineConfig } from 'vite';",
              '',
              '// https://vite.dev/config/',
              'export default defineConfig({',
              '  plugins: [',
              '    tailwindcss(),',
              '    react(),',
              '    babel({',
              '      presets: [reactCompilerPreset()],',
              '    }),',
              '  ],',
              '  resolve: {',
              '    alias: {',
              "      '@': path.resolve(import.meta.dirname, './src'),",
              '    },',
              '  },',
              '});',
              '',
            ].join('\n');
            await fsPromises.writeFile(viteConfigPath, content, 'utf8');
          } else if (!content.includes('@tailwindcss/vite')) {
            content =
              "import tailwindcss from '@tailwindcss/vite';\n" + content;

            if (content.includes('plugins: [react()]')) {
              content = content.replace(
                'plugins: [react()]',
                'plugins: [react(), tailwindcss()]',
              );
            } else if (content.includes('plugins: [react(),]')) {
              content = content.replace(
                'plugins: [react(),]',
                'plugins: [react(), tailwindcss()]',
              );
            } else {
              // Use regex for multi-line or standard spacing
              content = content.replace(
                /(plugins:\s*\[\s*react\(\),?\s*)(\])/g,
                '$1\n    tailwindcss(),\n  $2',
              );
            }
            await fsPromises.writeFile(viteConfigPath, content, 'utf8');
          }
        } catch {}

        // 6. Overwrite src/index.css to import Tailwind CSS v4
        const indexCssPath = path.join(webDir, 'src', 'index.css');
        try {
          await fsPromises.writeFile(
            indexCssPath,
            '@import "tailwindcss";\n',
            'utf8',
          );
        } catch {}

        s.stop(
          pc.green('✔ Success: Tailwind CSS v4 configured successfully\n'),
        );
      } catch (err: any) {
        s.stop(pc.red('✖ Failed: Tailwind CSS v4 setup failed'));
        throw err;
      }
    }

    if (setupShadcnPrompt) {
      // 8. Prompt for preset and initialize shadcn UI
      const hasPreset = await confirm({
        message: 'Do you have a custom shadcn UI preset code?',
        initialValue: false,
      });
      handleCancel(hasPreset);

      let presetCode = '';
      if (hasPreset) {
        const enteredPreset = await text({
          message: 'Enter your custom shadcn UI preset code:',
          placeholder: 'e.g. 123456',
          validate: (val) => {
            if (!val || !val.trim()) return 'Preset code cannot be empty';
            return;
          },
        });
        handleCancel(enteredPreset);
        presetCode = (enteredPreset as string).trim();
      }

      const args = ['dlx', 'shadcn@latest', 'init'];
      if (presetCode) {
        args.push('--preset', presetCode);
      }
      args.push('--template', 'vite');

      console.log(
        pc.cyan('\nStarting interactive shadcn UI initialization...'),
      );
      await runInteractiveCommand('pnpm', args, webDir);
      console.log(
        pc.green(
          isMonorepo
            ? `\n✔ Success: shadcn UI successfully initialized in apps/${createdDirName}\n`
            : `\n✔ Success: shadcn UI successfully initialized at root\n`,
        ),
      );
    }
    return webDir;
  } catch (error: any) {
    console.error(pc.red(`\n✖ Failed: Vite React frontend setup failed`));
    console.error(pc.red(`Error details: ${error.message || error}\n`));
    process.exit(1);
  }
}
