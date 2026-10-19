'use client';
import DocsCodeBlock from '../components/DocsCodeBlock';

export const BASIC_USAGE_TOC = [
  { id: 'cli-wizard', label: 'Interactive Wizard' },
  { id: 'directory-structure', label: 'Folder Structure' },
  { id: 'running-scripts', label: 'Running Scripts' },
  { id: 'importing-packages', label: 'Importing Packages' },
];

export const BasicUsageContent = () => {
  return (
    <div className="space-y-12">
      {/* Interactive Wizard */}
      <section id="cli-wizard" className="space-y-4">
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          The Interactive Wizard
        </h2>
        <p className="text-zinc-300 text-sm leading-relaxed">
          When you execute{' '}
          <code className="text-orange-400 font-mono text-xs bg-zinc-900 px-1.5 py-0.5 border border-zinc-800">
            npm create morax@latest
          </code>
          , you will be guided through a series of intuitive terminal prompts:
        </p>

        <DocsCodeBlock
          code={`$ npm create morax

? What is the name of your monorepo? › my-project

? Select applications in apps/:
  [x] Next.js Application (web)
  [x] Vite + React Template (desktop)

? Select shared packages in packages/:
  [x] Shared UI Components (@workspace/ui)
  [x] TypeScript Configurations (@workspace/typescript-config)
  [x] ESLint Base Rules (@workspace/eslint-config)

✔ Created workspace configuration
✔ Executing official generators dynamically...
✔ Injecting workspace symlinks into packages
✔ Bootstrapping dependencies via pnpm install...

✨ Successfully initialized my-project!`}
          language="text"
          title="Terminal Output"
        />
      </section>

      {/* Directory Structure */}
      <section
        id="directory-structure"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Monorepo Directory Layout
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Morax generates a clean, standard pnpm monorepo structure.
          Applications live in{' '}
          <code className="text-zinc-300 font-mono">apps/</code>, while reusable
          packages live in{' '}
          <code className="text-zinc-300 font-mono">packages/</code>:
        </p>

        <DocsCodeBlock
          code={`my-project/
├── apps/
│   ├── web/               # Next.js 15+ App Router application
│   └── desktop/           # Vite + React single page app
├── packages/
│   ├── ui/                # Shared UI component library
│   ├── eslint-config/     # Unified ESLint flat configs
│   └── typescript-config/ # Shared tsconfig bases
├── package.json           # Root workspace scripts & dependencies
└── pnpm-workspace.yaml    # PNPM packages declaration`}
          language="text"
          title="Directory Tree"
        />
      </section>

      {/* Running Scripts */}
      <section
        id="running-scripts"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Running Workspace Commands
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Enter your new project folder and use pnpm to execute commands across
          your entire monorepo:
        </p>

        <DocsCodeBlock
          code={`cd my-project

# Run all applications concurrently in development mode
pnpm dev

# Build all applications and packages
pnpm build

# Run linter across all packages
pnpm lint`}
          language="bash"
          title="Project Root"
        />

        <p className="text-zinc-400 text-sm leading-relaxed">
          To run scripts for a specific application only, use the{' '}
          <code className="text-orange-400 font-mono text-xs">--filter</code>{' '}
          flag:
        </p>

        <DocsCodeBlock
          code={`# Run only the Next.js web application
pnpm --filter web dev

# Run only the Vite desktop application
pnpm --filter desktop dev`}
          language="bash"
          title="Filtered Execution"
        />
      </section>

      {/* Importing Packages */}
      <section
        id="importing-packages"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Importing Shared Packages
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Morax automatically links shared packages into your application{' '}
          <code className="text-zinc-300 font-mono">package.json</code> files
          using pnpm’s{' '}
          <code className="text-orange-400 font-mono">workspace:*</code>{' '}
          protocol.
        </p>
        <p className="text-zinc-400 text-sm leading-relaxed">
          You can import components directly into your Next.js or Vite apps with
          zero extra build steps:
        </p>

        <DocsCodeBlock
          code={`// Inside apps/web/src/app/page.tsx
import { Button } from '@workspace/ui/components/button';

export default function Page() {
  return (
    <main>
      <h1>Hello from Next.js</h1>
      <Button variant="default">Shared UI Button</Button>
    </main>
  );
}`}
          language="tsx"
          title="apps/web/src/app/page.tsx"
        />
      </section>
    </div>
  );
};

export default BasicUsageContent;
