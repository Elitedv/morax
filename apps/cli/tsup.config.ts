import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  clean: true,
  sourcemap: true,
  dts: false,
  splitting: true,
  platform: 'node',
  // Don't bundle node_modules — import them at runtime to avoid
  // CJS dynamic-require issues (e.g. whatwg-url require('punycode'))
  noExternal: [],
  external: [/^[^.\/]|^\.[^.\/]|^\.\.[^\/]/], // all bare specifiers = external
  banner: {
    js: '#!/usr/bin/env node',
  },
});
