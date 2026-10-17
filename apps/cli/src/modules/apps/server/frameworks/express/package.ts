import type { ServerRuntime } from '../../types.js';

export function getExpressDependencies(): string[] {
  return ['express', 'cors'];
}

export function getExpressDevDependencies(runtime: ServerRuntime): string[] {
  const common = [
    '@types/express',
    '@types/cors',
    'tsdown',
    'typescript@latest',
  ];
  if (runtime === 'bun') {
    return [...common, '@types/bun'];
  }
  return [...common, '@types/node', 'tsx'];
}

export function getExpressScripts(runtime: ServerRuntime, linter?: string) {
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
