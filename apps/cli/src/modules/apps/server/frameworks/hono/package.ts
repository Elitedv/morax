import type { ServerRuntime } from '../../types.js';

export function getHonoDependencies(runtime: ServerRuntime): string[] {
  if (runtime === 'bun') {
    return ['hono'];
  }
  return ['hono', '@hono/node-server'];
}

export function getHonoDevDependencies(runtime: ServerRuntime): string[] {
  const common = ['tsdown', 'typescript@latest'];
  if (runtime === 'bun') {
    return [...common, '@types/bun'];
  }
  return [...common, '@types/node', 'tsx'];
}

export function getHonoScripts(runtime: ServerRuntime, linter?: string) {
  const scripts: Record<string, string> = {
    dev:
      runtime === 'bun'
        ? 'cd ../.. && bun --watch apps/server/src/index.ts'
        : 'tsx watch src/index.ts',
    build: 'tsdown',
    start: runtime === 'bun' ? 'bun dist/index.js' : 'node dist/index.js',
    check: 'tsc --noEmit',
  };

  if (linter === 'biome') {
    scripts.lint = 'biome lint .';
  } else if (linter === 'oxlint') {
    scripts.lint = 'oxlint .';
  }

  return scripts;
}
