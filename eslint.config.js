import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import eslintConfigPrettier from 'eslint-config-prettier';

// Shared unused-variable preferences for JavaScript and TypeScript.
const unusedVarsOptions = {
  args: 'after-used',
  argsIgnorePattern: '^_',
  caughtErrors: 'none',
  ignoreRestSiblings: true,
};

export default defineConfig([
  // Ignore generated files and directories across all applications.
  globalIgnores([
    '**/dist/**',
    '**/build/**',
    '**/coverage/**',
    '**/.cache/**',
    '**/.vite/**',
    '**/.vscode/**',
    '**/.idea/**',
  ]),

  // Recommended JavaScript and TypeScript rules.
  js.configs.recommended,
  tseslint.configs.recommended,

  // Shared code-quality rules.
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],

    rules: {
      'prefer-const': 'warn',
      'no-var': 'error',
      eqeqeq: 'warn',
      curly: ['warn', 'multi-or-nest'],
      'no-console': 'off',
    },
  },

  // JavaScript-specific unused-variable rule.
  {
    files: ['**/*.{js,mjs,cjs}'],

    rules: {
      'no-unused-vars': ['warn', unusedVarsOptions],
    },
  },

  // TypeScript-specific unused-variable rule.
  {
    files: ['**/*.{ts,tsx}'],

    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', unusedVarsOptions],
    },
  },

  // Node.js globals for the backend and MCP server.
  {
    files: ['server/**/*.{ts,js}', 'mcp-server/**/*.{ts,js}'],

    languageOptions: {
      globals: globals.node,
    },
  },

  // Browser globals for the React client.
  {
    files: ['client/**/*.{ts,tsx,js,jsx}'],

    languageOptions: {
      globals: globals.browser,
    },
  },

  // React-specific rules for the client.
  {
    files: ['client/**/*.{ts,tsx}'],

    extends: [reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
  },

  // Disable ESLint formatting rules that conflict with Prettier.
  eslintConfigPrettier,
]);
