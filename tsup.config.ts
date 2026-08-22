import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: { index: 'src/index.ts', consent: 'src/consent/index.ts' },
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
  {
    // The consent widget <script> build served at kookee.dev/consent/v1.js. Same
    // default-export-as-global trick: `KookeeConsent` on the page IS the API object.
    entry: { consent: 'src/consent/browser.ts' },
    outDir: 'dist',
    format: ['iife'],
    globalName: 'KookeeConsent',
    sourcemap: false,
    splitting: false,
    minify: true,
    treeshake: true,
  },
]);
