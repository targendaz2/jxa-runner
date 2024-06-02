// @ts-check
import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

const config = tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  eslintConfigPrettier,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
);

export default config;
