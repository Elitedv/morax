'use client';

import React from 'react';
import DocsCodeBlock from '../components/DocsCodeBlock';

export const SHARED_UI_TOC = [
  { id: 'overview', label: 'Overview' },
  { id: 'architecture', label: 'Package Structure' },
  { id: 'components', label: 'Creating UI Primitives' },
  { id: 'importing-apps', label: 'Consuming in Apps' },
  { id: 'zero-build', label: 'Zero-Build Symlinks' },
];

export const SharedUiContent = () => {
  return (
    <div className="space-y-12">
      {/* Overview */}
      <section id="overview" className="space-y-4">
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Shared UI Package (`@workspace/ui` / `@repo/ui`)
        </h2>
        <p className="text-zinc-300 text-sm leading-relaxed">
          The shared UI package provides accessible, customizable components
          built with Tailwind CSS and Radix UI primitives. It eliminates
          duplicated design code between your Next.js and Vite applications.
        </p>
      </section>

      {/* Package Structure */}
      <section
        id="architecture"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Package Layout
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          The UI package lives in{' '}
          <code className="text-orange-400 font-mono text-xs bg-zinc-900 px-1.5 py-0.5 border border-zinc-800">
            packages/ui
          </code>
          :
        </p>

        <DocsCodeBlock
          code={`packages/ui/
├── src/
│   ├── components/
│   │   ├── button.tsx      # CVA button with variants
│   │   ├── card.tsx        # Container card with header/footer
│   │   ├── dialog.tsx      # Modal dialogs
│   │   └── dropdown.tsx    # Accessible dropdown menus
│   └── lib/
│       └── utils.ts        # cn() helper (clsx + tailwind-merge)
├── package.json            # Exports definition
└── tsconfig.json           # Shared base tsconfig`}
          language="text"
          title="packages/ui Structure"
        />
      </section>

      {/* Creating Primitives */}
      <section
        id="components"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Creating UI Primitives with CVA
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Components use Class Variance Authority (CVA) to provide strict
          variant typings:
        </p>

        <DocsCodeBlock
          code={`// packages/ui/src/components/button.tsx
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-white text-black hover:bg-zinc-200',
        outline: 'border border-zinc-800 bg-transparent hover:bg-zinc-900 text-white',
        ghost: 'hover:bg-zinc-800 text-zinc-300 hover:text-white',
      },
      size: {
        default: 'h-9 px-4 py-2 text-sm',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-10 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);`}
          language="tsx"
          title="Button CVA Definition"
        />
      </section>

      {/* Consuming in Apps */}
      <section
        id="importing-apps"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Importing into Applications
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          In your app's{' '}
          <code className="text-zinc-300 font-mono">package.json</code>, Morax
          adds the dependency via the PNPM workspace protocol:
        </p>

        <DocsCodeBlock
          code={`"dependencies": {
  "@workspace/ui": "workspace:*"
}`}
          language="json"
          title="package.json"
        />
      </section>

      {/* Zero Build */}
      <section
        id="zero-build"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Zero-Build Symlinks
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          There is no compilation step or watch daemon required for the UI
          package. Next.js and Vite transpile TypeScript source files on the fly
          during development.
        </p>
      </section>
    </div>
  );
};

export default SharedUiContent;
