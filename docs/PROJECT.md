# 🚀 Morax: The Next-Gen `pnpm` Monorepo & Workspace Scaffolder

## 🌟 The Philosophy

**Morax** is a command-line utility designed to scaffold modern, high-performance web applications with a production-ready developer experience (DX).

### The Problem: There is No CLI for `pnpm` Workspaces

In the modern JavaScript ecosystem, **`pnpm` Workspaces (Monorepos)** are the golden standard for organizing multiple apps (e.g., Next.js, Vite/React, Hono API) and shared libraries (UI components, DB schemas, eslint, configs) in a single repository.

However, **there is currently no official CLI to initialize or bootstrap a pnpm workspace.**
To set one up, developers have to manually:

1. Initialize a blank root package.json and set it to `"private": true`.
2. Manually write `pnpm-workspace.yaml`.
3. Create `apps/` and `packages/` folders.
4. Manually configure workspace symlinking/references (`workspace:*`).
5. Wire up shared TSConfigs, ESLint configurations, and Tailwind settings across directories.

While tools like Turborepo (`npx create-turbo@latest`) exist, they are highly rigid and generate pre-baked structures that are hard to customize.

**Morax bridges this gap, providing a beautiful, interactive CLI that bootstraps custom, modern pnpm workspaces in seconds.**

---

## 🛠️ The Monorepo Architecture: Dynamic Workspace Orchestration

Instead of copying outdated static boilerplate folders, Morax acts as a **smart orchestrator** of pnpm, Turborepo, and official framework CLIs to construct a clean, cohesive monorepo:

```
[User runs npx @elitedv/morax]
         │
         ▼
 1. Workspace Configuration Prompt
    • "What is the name of your monorepo?"
    • "Which apps would you like inside apps/? (Next.js, Vite+React, Hono API)"
    • "Which shared packages in packages/? (UI component library, DB schemas, Configs, Utils)"
         │
         ▼
 2. Bootstrap Workspace Root
    • Creates directory, registers `pnpm-workspace.yaml`, and configures root package.json.
    • Set up Turborepo (`turbo.json`) for lightning-fast cross-app builds.
         │
         ▼
 3. Scaffold Applications (Dynamic Framework Execution)
    • Navigates to `apps/` and executes native, official generators:
      ├── Next.js: `npx create-next-app@latest web --typescript --tailwind --app ...`
      └── Vite: `npm create vite@latest desktop-client --template react-ts`
         │
         ▼
 4. Scaffold Shared Libraries & Injections
    • Generates internal shared packages inside `packages/`:
      ├── `packages/typescript-config`: Shared tsconfig base files
      ├── `packages/eslint-config`: Shared linting base files
      ├── `packages/ui`: Component library (dynamically installs and runs `shadcn@latest init`)
      └── `packages/db`: Shared Prisma or Drizzle schema and client
         │
         ▼
 5. Automatic Dependency Linking & Dependency Resolution
    • Programmatically links internal packages (e.g., adding `"@workspace/ui": "workspace:*"` to Next.js app package.json).
    • Executes `pnpm install` at the workspace root to resolve all workspace references automatically.
```

---

## 🏗️ Structure of the Generated Workspace

The CLI generates a standard, highly scalable monorepo structure:

```
my-monorepo/
├── apps/
│   ├── web/                 # Next.js Application
│   └── api/                 # Express or Hono Backend Application
├── packages/
│   ├── ui/                  # Shared UI components (Tailwind + Shadcn)
│   ├── db/                  # Shared DB client (Prisma/Drizzle + Schema)
│   ├── typescript-config/   # Shared TypeScript configuration base
│   └── eslint-config/       # Shared linting rules
├── pnpm-workspace.yaml      # Declares pnpm packages directories
├── package.json             # Root private configuration & runner scripts
└── pnpm-lock.yaml           # Workspace-wide lockfile
```

---

## 🔍 Case Study: How `create-better-t-stack` and `create-turbo` Work

### 1. `create-turbo` (Turborepo CLI)

- **What they do:** Initializes a quick pnpm/npm monorepo.
- **Limitations:** Very opinionated and static. It sets up a fixed pre-configured project (usually featuring a basic Next.js app and an internal React component library). Adding a new app or trying to configure databases/auth requires you to manually copy files or search for templates.

### 2. `create-better-t-stack`

- **What they do:** Uses conditional rendering templates (Handlebars) to generate monorepos featuring tRPC, Hono, Next.js, and Drizzle.
- **Limitations:** Because they rely on pre-written monorepo files, any major updates to Next.js or Drizzle require the maintainers to refactor their generator code, meaning templates fall out of sync with new standard libraries.

### **Morax's Edge:**

By executing official CLIs (`create-next-app`, `shadcn init`) inside `apps/` and `packages/ui`, and then programmatically editing `package.json` to link the shared libraries, Morax:

1. **Never gets outdated:** Next.js and Shadcn CLI handle the boilerplate updates.
2. **Infinite Flexibility:** The user chooses exactly what goes into the monorepo, and Morax wires them together.

---

## 🚀 Proposed Technical Flow for Morax (pnpm Workspaces)

When executing `npx @elitedv/morax`:

1. **Root Setup:**
   - Create target directory.
   - Write `pnpm-workspace.yaml`:
     ```yaml
     packages:
       - 'apps/*'
       - 'packages/*'
     ```
   - Write root `package.json` with `"private": true` and `"packageManager": "pnpm@9.x.x"`.

2. **Scaffold Apps:**
   - Run `npx create-next-app@latest apps/web --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`

3. **Scaffold Packages:**
   - Create `packages/typescript-config/package.json` & configurations.
   - Create `packages/ui` (Shared Component package):
     - Run `npx shadcn@latest init` inside `packages/ui` and install components.
   - If DB is selected:
     - Create `packages/db/` and run `npx prisma init` or `npx drizzle-kit init`.

4. **Link Workspace Packages:**
   - Inject `"@workspace/ui": "workspace:*"` into `apps/web/package.json` dependencies.
   - Inject `"@workspace/db": "workspace:*"` into `apps/web/package.json` dependencies.
   - Patch imports so the user can import shared buttons or DB clients directly inside their app.

5. **Bootstrap all dependencies:**
   - Run `pnpm install` in the root folder to link workspaces and build the local cache.
