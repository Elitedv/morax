# Morax CLI — Architectural Guidelines & Core Principles

This document defines the core development principles, package management strategies, and scaffolding standards for the **Morax CLI**.

---

## 1. Dynamic Installation over Static Version Copy-Pasting

### Principle

Morax will **never** hardcode package versions or copy-paste static dependency blocks into a pre-written `package.json` file. Every dependency, dev-dependency, framework library, and utility must be installed dynamically via `pnpm add` / `pnpm init` at scaffold time.

### The Canonical Workflow for Every App & Package

When Morax creates any package or application (e.g., `apps/server`, `packages/prettier`, `packages/db`):

1. **Initialize fresh**:
   Run `pnpm init` inside the designated target directory to generate a clean, standard baseline `package.json`.
2. **Apply essential structural modifications**:
   Programmatically update `package.json` fields:
   - Configure `"private": true`, `"type": "module"`, `"name": "<package-name>"`.
   - Set workspace scripts (`dev`, `build`, `start`, `lint`).
   - Clean up default template fields (`keywords`, `license`, `author`).
3. **Execute real package installations**:
   Run explicit install commands dynamically:
   - Runtime dependencies: `pnpm add <packages>` (e.g., `pnpm add express cors`)
   - Development dependencies: `pnpm add -D <packages>` (e.g., `pnpm add -D @types/express @types/cors tsx typescript`)
4. **Author source code**:
   Generate clean, idiomatic starter files (e.g., `src/index.ts`, `tsconfig.json`) on top of the newly installed and verified dependencies.

### Why This Matters

- **Always Latest & Secure**: Projects created with Morax automatically pull the latest stable, non-vulnerable versions of packages from the npm registry without needing manual CLI updates.
- **Integrity of Resolution**: `pnpm` handles peer dependency resolutions and generates an authentic lockfile accurately reflecting live registry metadata.
- **No Stale Dependencies**: As third-party libraries update, Morax does not hold back developers with outdated version pins.

---

## 2. Official CLI Delegation over Custom Re-Implementation

### Principle

Whenever an official, community-standard, or framework-provided CLI exists (e.g., `create-next-app`, `npm init @eslint/config@latest`, `npx shadcn init`, `drizzle-kit init`), Morax will **delegate directly to that official CLI** rather than trying to replicate or reverse-engineer its boilerplate files.

### The Canonical Workflow for Frameworks and Tooling

1. **Invoke the Official CLI**:
   Run the official scaffolding tool inside the designated workspace path:
   - **Frontend Apps**: `pnpm dlx create-next-app@latest apps/web ...` or `npm create vite@latest apps/web ...`
   - **Linting & Code Standards**: `npm init @eslint/config@latest`
   - **UI Component Systems**: `pnpm dlx shadcn@latest init` inside `packages/ui`
   - **ORM / Database Tooling**: Official init commands provided by Drizzle / Prisma.
2. **Targeted Post-Scaffolding Adjustments**:
   Morax only intervenes _after_ the official CLI has finished to apply workspace-specific glue:
   - Link internal monorepo dependencies (e.g., injecting `"@repo/ui": "workspace:*"` into `apps/web/package.json`).
   - Wire root configuration files (e.g., extending shared `tsconfig.base.json`).
3. **Allow User Interactive Customization**:
   Where appropriate, allow interactive flags or presets from the official CLI so users can configure preferences (like Shadcn color themes, font selections, or ESLint rules) directly from the tool's authors.

### Why This Matters

- **Zero Template Drift**: When Next.js or Shadcn updates their internal directory conventions, Tailwind versions, or config formats, Morax remains compatible automatically.
- **Zero Maintenance Burden**: The Morax team does not need to maintain thousands of lines of fragile starter templates or continuously fix breaking changes in upstream tools.
- **Native Developer Experience**: Developers get the authentic, officially recommended setup as designed by the creators of each framework.
