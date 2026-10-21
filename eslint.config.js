import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';

export default [
  { ignores: ['dist/', '.astro/', 'node_modules/', 'public/', '.lighthouseci/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    languageOptions: {
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        localStorage: 'readonly',
        IntersectionObserver: 'readonly',
        requestAnimationFrame: 'readonly',
        fetch: 'readonly',
        URLSearchParams: 'readonly',
        FormData: 'readonly',
        console: 'readonly',
        process: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        matchMedia: 'readonly',
        HTMLElement: 'readonly',
        Element: 'readonly',
        getComputedStyle: 'readonly',
        location: 'readonly',
        Event: 'readonly',
        CustomEvent: 'readonly',
        sessionStorage: 'readonly',
        URL: 'readonly',
        Intl: 'readonly',
      },
    },
    rules: { '@typescript-eslint/no-explicit-any': 'off', 'no-undef': 'off' },
  },
];
