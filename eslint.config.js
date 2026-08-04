import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import eslintConfigPrettier from 'eslint-config-prettier'
import globals from 'globals'

export default tseslint.config(
  {
    ignores: ['**/dist/**', '**/node_modules/**', 'docs/**', '**/*.config.js'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['frontend/**/*.{ts,tsx}'],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  {
    // shadcn/ui convention: component files also export cva variant helpers.
    files: [
      'frontend/src/components/ui/**/*.tsx',
      'frontend/src/components/ui-kit/**/*.tsx',
    ],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    files: ['backend/**/*.ts', 'packages/**/*.ts'],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      // Structured logging goes through config/logger.ts (pino) so log level,
      // redaction, and JSON output stay consistent — see the Phase 6
      // monitoring/logging pass.
      'no-console': 'error',
    },
  },
  {
    // Test files mock Prisma/library return shapes with partial objects —
    // typing those fully adds no safety since the real types are re-derived
    // from schema, not hand-authored here.
    files: ['**/*.test.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
)
