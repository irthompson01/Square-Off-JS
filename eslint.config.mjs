import eslint from '@eslint/js';
import globals from 'globals';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat();

export default [
  {
    ignores: [
      'public/libraries/**',
      '**/secureServer.js'
    ]
  },
  eslint.configs.recommended,
  ...compat.config({
    env: { node: true },
    // ... other eslintrc-style configurations
  }),
  {
    files: ['src/controllers/socketHandlers.js'],
    rules: {
      'no-unused-vars': ['error', { 'argsIgnorePattern': '^io$' }]
    }
  },
  {
    files: ['src/utils/roomUtils.js'],
    rules: {
      'no-undef': 'off'
    }
  },
  {
    files: ['public/js/*.js'],  // Apply to all JS files in public/js
    languageOptions: {
      globals: {
        p5: 'readonly',
        sendData: 'readonly',
        isClientConnected: 'readonly',
        isHostConnected: 'readonly',
        hostConnected: 'writable',
        makeIdFromList: 'readonly',
        roomId: 'writeable',
        socket: 'writable',
        _processUrl: 'readonly',
        io: 'readonly'
      }
    }
  },
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
