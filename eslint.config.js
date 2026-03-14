import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['pb_data/**', 'node_modules/**', 'dist/**', 'build/**', 'playwright.config.ts', 'vite.config.ts', 'postcss.config.js', 'tailwind.config.js'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off'
    }
  }
);
