import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // Every public method takes a named params interface, even where it currently adds
      // nothing to what it extends (`interface BlogGetBySlugParams extends LocaleOptions {}`).
      // The name is the stable part of the API: fields can be added later without consumers
      // having to rename the type they import. Collapsing these to aliases would trade that
      // for nothing.
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },
  {
    // gtag.js only processes dataLayer entries that are raw `arguments` objects; a rest
    // array is silently ignored, so the gtag stub there has to use `arguments`.
    files: ['src/consent/consent-mode.ts'],
    rules: {
      'prefer-rest-params': 'off',
    },
  }
);
