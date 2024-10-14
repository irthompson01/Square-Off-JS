import eslint from '@eslint/js';
import globals from 'globals';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat();

export default [
  eslint.configs.recommended,
  ...compat.config({
    env: { node: true },
    // ... other eslintrc-style configurations
  }),
  {
    languageOptions: {
      globals: {
        ...globals.node
      },
    },
    // ... other flat-config style configurations
  },
];
