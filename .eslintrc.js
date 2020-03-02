module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console': 'off',
    'semi': ['error', 'always'],
    'indent': ['error', 4, { 'SwitchCase': 1 }],
    'space-before-function-paren': ['error', 'never'],
    'arrow-spacing': 'error'
  }
}
