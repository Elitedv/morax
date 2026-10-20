# Local Development: Building & Linking Morax CLI

This guide explains how to build, link, and test the **Morax CLI** (`create-morax`) locally on your machine using `npm link --force`.

---

## 1. Overview & Architecture

The CLI lives in `apps/cli/` and is built using **tsup** into an executable ESM bundle:

- **Source Code**: `apps/cli/src/`
- **Entrypoint**: `apps/cli/src/index.ts`
- **Compiler**: `tsup` (configured in `tsup.config.ts`)
- **Distribution Bundle**: `apps/cli/dist/index.js` (with `#!/usr/bin/env node` shebang)
- **Global Binary Commands**:
  - `create-morax`
  - `morax`

When you link the package locally, npm creates a global symlink directly pointing to your local `apps/cli/` build. Any time you rebuild `dist/index.js`, your global `create-morax` and `morax` commands immediately use the updated code without reinstalling.

---

## 2. Step-by-Step Workflow

### Step 1: Compile the CLI Bundle

Compile the TypeScript source files into the production bundle in `dist/`:

```bash
# Option A: From monorepo root
pnpm --filter create-morax build

# Option B: Directly from apps/cli
cd apps/cli
pnpm build
```

Verify that `apps/cli/dist/index.js` is generated without any build errors:

```bash
ESM dist/index.js     ~176 KB
ESM dist/index.js.map ~302 KB
ESM ⚡️ Build success
```

---

### Step 2: Globally Link the Package (`npm link --force`)

Run `npm link --force` inside the `apps/cli/` directory:

```bash
cd apps/cli
npm link --force
```

> **Why `--force`?**  
> Using the `--force` flag ensures npm overrides any existing global installations or stale symlinks from previous versions (or published npm releases), guaranteeing your global `create-morax` and `morax` binaries point directly to your current local build.

---

### Step 3: Test the Locally Linked CLI

Open any terminal in a separate directory (e.g., your Desktop or a test folder) and invoke the CLI directly:

```bash
# Test the primary interactive wizard
create-morax

# Or use the short alias
morax

# Test standalone flags
morax --react
morax --next
```

Verify that:

1. The Morax ASCII banner renders.
2. Preflight checks (Node.js, pnpm, Bun, Docker, Git) complete successfully.
3. Workspace prompts and directory generation work as expected.

---

## 3. The Rapid Edit-Build-Test Loop

Because `npm link` points directly to your repository's `apps/cli/` directory, testing changes is fast:

```
┌─────────────────────────────────┐
│ 1. Modify src/ in apps/cli      │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│ 2. Run: pnpm --filter ... build │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│ 3. Run: create-morax in test dir│
└─────────────────────────────────┘
```

1. **Edit**: Modify files in `apps/cli/src/` (prompts, templates, generators).
2. **Rebuild**: Run `pnpm --filter create-morax build`.
3. **Execute**: Run `create-morax` in your test folder immediately—no need to re-run `npm link`.

---

## 4. Unlinking & Cleanup

When you are finished with local testing and want to switch back to the official registry releases:

```bash
# Remove global symlink from anywhere:
npm unlink -g create-morax

# Or remove symlink from within apps/cli:
cd apps/cli
npm unlink
```

To verify that the local link is removed:

```bash
which create-morax   # On macOS/Linux
Get-Command create-morax # On Windows PowerShell
```

---

## 5. Troubleshooting & Tips

### 1. Windows PowerShell Script Execution Policy

On Windows, if you encounter an error like:

```text
npm : File ... npm.ps1 cannot be loaded because running scripts is disabled on this system.
```

Use `npm.cmd` explicitly:

```powershell
npm.cmd link --force
```

### 2. Live Watch Mode during Development

If you are iterating heavily on CLI logic without needing global binary execution, you can run the source code directly with live execution using `tsx`:

```bash
# Inside apps/cli
pnpm dev

# Or with arguments
pnpm dev --react
```
