import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import globals from 'globals'

export default [
  js.configs.recommended,
  {
    plugins: {},
    rules: {
      'no-unused-vars': 'off',
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: globals.node,
    },
  },
  eslintConfigPrettier,
]
