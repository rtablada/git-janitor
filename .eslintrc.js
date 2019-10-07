module.exports = {
  env: {
    'node': true,
    es2017: true
  },
  plugins: ['prettier'],
  extends: ['plugin:prettier/recommended', 'eslint:recommended'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
};
