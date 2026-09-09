import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import astro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist/', '.astro/', 'node_modules/', 'tmp/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    // Node scripts outside the Astro build.
    files: ['scripts/**'],
    languageOptions: { globals: { console: 'readonly', process: 'readonly' } },
  },
  prettier,
);
