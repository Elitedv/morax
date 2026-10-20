# Publishing `create-morax` to npm

This guide outlines the step-by-step procedure for building, verifying, and publishing new releases of the **`create-morax`** CLI package to the public [npm registry](https://www.npmjs.com/package/create-morax).

---

## 1. Prerequisites

Before publishing, ensure:

1. You have push access to the repository and publishing permissions on npm.
2. You are logged into npm in your terminal:
   ```bash
   npm whoami
   # Should output: ashutoshdm1 (or your npm username)
   ```
   If not logged in, run:
   ```bash
   npm login
   ```
3. Your local git workspace is clean and up to date.

---

## 2. Package & Build Architecture

The CLI lives in `apps/cli/` and is configured as follows:

- **Entrypoint**: `src/index.ts`
- **Build tool**: `tsup` (configured in `tsup.config.ts`), generating `dist/index.js` as an executable ESM bundle with shebang (`#!/usr/bin/env node`).
- **Binaries exposed**:
  - `create-morax`
  - `morax`
- **README Swap Lifecycle**:
  - `prepublishOnly`: Swaps `README.npm.md` to `README.md` so npm displays the focused CLI README on the package page.
  - `postpublish`: Swaps the original files back (`README.github.md` → `README.md`, `README.md` → `README.npm.md`).

---

## 3. Step-by-Step Publishing Workflow

### Step 1: Bump Version in `apps/cli/package.json`

Navigate to `apps/cli/package.json` and update the `"version"` field adhering to [Semantic Versioning](https://semver.org/):

```json
{
  "name": "create-morax",
  "version": "2.0.2",
  ...
}
```

- **Patch** (`2.0.1` → `2.0.2`): Bug fixes, template refinements, documentation updates.
- **Minor** (`2.0.2` → `2.1.0`): New framework scaffolds, flags, or CLI features (backwards-compatible).
- **Major** (`2.1.0` → `3.0.0`): Breaking architectural changes or CLI prompt overhauls.

---

### Step 2: Build the CLI Bundle

Compile TypeScript source files into the production bundle:

```bash
# From workspace root
pnpm --filter create-morax build

# Or directly in apps/cli
cd apps/cli
pnpm build
```

Verify that `dist/index.js` is updated without any compilation errors.

---

### Step 3: Dry-Run Verification

Before publishing to the live registry, execute a dry run to inspect the packaged files, package size, and ensure lifecycle scripts run without issues:

```bash
cd apps/cli
npm publish --dry-run
```

Ensure the tarball contents include:

- `dist/index.js`
- `dist/index.js.map`
- `README.md`
- `package.json`

---

### Step 4: Publish to npm

Publish the package to the official registry:

```bash
cd apps/cli
npm publish
```

> **Note**: If your npm account has 2FA (Two-Factor Authentication) enabled for publishing, append `--otp=<code>` or enter the authentication code when prompted.

---

### Step 5: Verify Registry Deployment

Check that the new version is available on npm:

```bash
# Check the latest tag
npm view create-morax version

# Check all published versions
npm view create-morax versions --json
```

> **Note**: npm's edge CDN may take 30–90 seconds to propagate the latest tag globally.

---

### Step 6: Test the Live CLI

Verify that users can bootstrap new workspaces with the updated release:

```bash
npm create morax@latest
# or
pnpm create morax@latest
# or
bun create morax@latest
```

---

## 4. Troubleshooting & Edge Cases

### 1. `Cannot publish over previously staged version "X.Y.Z"` (E409 Conflict)

npm CLI v10/v11 processes package uploads asynchronously. If an upload was recently triggered or queued, wait 60–120 seconds for the indexing pipeline to finish before re-checking with `npm view create-morax version`.

### 2. README Files Left Swapped after Cancelled Publish

If `npm publish` is interrupted before the `postpublish` hook executes, run this command in `apps/cli` to restore the file names:

```bash
node -e "const fs = require('fs'); fs.renameSync('README.md', 'README.npm.md'); fs.renameSync('README.github.md', 'README.md')"
```

### 3. Git Commit & Tag

Once published, commit the version bump and create a git tag:

```bash
git add apps/cli/package.json
git commit -m "chore(release): create-morax v2.0.2"
git tag v2.0.2
git push origin main --tags
```
