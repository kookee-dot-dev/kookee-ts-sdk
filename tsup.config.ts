import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    outDir: 'dist',
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    sourcemap: false,
    splitting: false,
    minify: true,
    treeshake: true,
  },
  {
    // The <script> build served at kookee.dev/sdk/latest.js. Built from its own entry so
    // the default export becomes the global — `new Kookee({...})` on the page, not
    // `Kookee.Kookee`. Without globalName the bundle assigns nothing and is unusable.
    entry: { index: 'src/browser.ts' },
    outDir: 'dist',
    format: ['iife'],
    globalName: 'Kookee',
    sourcemap: false,
    splitting: false,
    minify: true,
    treeshake: true,
  },
]);
