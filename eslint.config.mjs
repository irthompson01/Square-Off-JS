import eslint from '@eslint/js';
import globals from 'globals';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat();

export default [
  {
    ignores: ['public/libraries/**']
  },
  eslint.configs.recommended,
  ...compat.config({
    env: { node: true },
    // ... other eslintrc-style configurations
  }),
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser
      },
    },
    // ... other flat-config style configurations
  },
];
