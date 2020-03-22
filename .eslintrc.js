module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'prettier',
    'prettier/vue',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended'
  ],
  plugins: [
    'prettier'
  ],
  // add your custom rules here
  rules: {
    'vue/html-closing-bracket-newline': 'off',
    'nuxt/no-cjs-in-config': 'off',
    'no-console': 0,
    'no-alert': 0,
    'no-debugger': 0,
    '@typescript-eslint/no-unused-vars': ['error', { args: 'all', argsIgnorePattern: '^_' }]
  },
  settings: {
    'import/resolver': {
      'babel-module': {
        'root': '.',
        'alias': {
          '~': './src',
          '@': './src',
          '~~': '.',
          '@@': '.'
        }
      }
    }
  }
}
