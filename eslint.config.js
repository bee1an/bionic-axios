import antfu from '@antfu/eslint-config'

export default antfu({
  type: 'lib',
  vue: false,
  formatters: true,
  ignores: ['**/dist/**', '**/node_modules/**', '**/coverage/**', '**/.vitepress/cache/**'],
  rules: {
    // 圈复杂度最大为 15
    'complexity': [2, { max: 15 }],
    // 要求使用 === 而不是 ==
    'eqeqeq': [2, 'always'],
    // 允许一个变量声明多个变量
    'one-var': [2, 'never'],
    // 文件最大行数为 300
    'max-lines': [2, { max: 300 }],
    // 禁止使用 console
    'no-console': 2,
    // 禁止使用 debugger
    'no-debugger': 2,
    // 禁止使用 undefined
    'no-undefined': 2,
    // 禁止不必要的括号
    'style/no-extra-parens': 2,
  },
})
