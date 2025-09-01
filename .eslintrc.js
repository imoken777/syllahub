/** @type {import('eslint').Linter.Config} */
const config = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'next/core-web-vitals',
    'prettier',
    'plugin:tailwindcss/recommended',
  ],
  plugins: ['tailwindcss', 'unused-imports', 'neverthrow'],
  settings: {
    tailwindcss: {
      callees: ['cn'],
    },
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/stylistic-type-checked',
      ],
      plugins: ['@typescript-eslint'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: 'tsconfig.json',
        ecmaFeatures: {
          jsx: true,
        },
      },
      rules: {
        'neverthrow/must-use-result': 'error',

        // Any型の使用を禁止
        '@typescript-eslint/no-explicit-any': 'error',
        // 返り値の省略を許容
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        // 型インポートの使用を推奨
        '@typescript-eslint/consistent-type-imports': [
          'warn',
          {
            prefer: 'type-imports',
          },
        ],
        // tsconfig.jsonの設定と被っているためOFF
        '@typescript-eslint/no-unused-vars': 'off',
        // Switch文の全検査を必須に
        '@typescript-eslint/switch-exhaustiveness-check': 'error',
        //
        '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      },
    },
  ],
  rules: {
    // console.logが残っていればwarn
    'no-console': [
      'warn',
      {
        allow: ['warn', 'info', 'error'],
      },
    ],
    // for in, for of, enumの使用は非推奨
    'no-restricted-syntax': [
      'warn',
      {
        selector: 'ForInStatement',
        message:
          'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
      },
      {
        selector: 'ForOfStatement',
        message:
          'iterators/generators require regenerator-runtime, which is too heavyweight for this guide to allow them. Separately, loops should be avoided in favor of array iterations.',
      },
      {
        selector: 'TSEnumDeclaration',
        message: "Don't declare enums",
      },
    ],
    // arrow functionの使用を推奨
    'prefer-arrow-callback': 'warn',
    // constの使用を推奨
    'prefer-const': 'warn',
    // テンプレートリテラルの使用を推奨
    'prefer-template': 'warn',
    // 必要な場合のみ囲む
    'arrow-body-style': ['warn', 'as-needed'],
    // reactの明示的なimportは不要なので禁止
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'react',
            importNames: ['default'],
          },
        ],
      },
    ],
    // 未使用propsの削除を推奨
    'react/no-unused-prop-types': 'warn',
    // JSXのbooleanの削除を推奨
    'react/jsx-boolean-value': 'warn',
    // JSXの自己終了タグの使用を推奨
    'react/self-closing-comp': [
      'warn',
      {
        component: true,
        html: true,
      },
    ],
    // 名前付きコンポーネントはアロー関数で定義することを推奨
    'react/function-component-definition': [
      'warn',
      {
        namedComponents: 'arrow-function',
      },
    ],
    '@next/next/no-html-link-for-pages': ['error', ['app', 'src']],
    'tailwindcss/classnames-order': 'warn',
    // 型インポートのトップレベルを推奨
    'import/consistent-type-specifier-style': ['warn', 'prefer-top-level'],
    // 未使用importの削除を推奨
    'unused-imports/no-unused-imports': 'warn',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    'no-unused-vars': 'off',
    // @typescript-eslintを使用
    'no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-expressions': 'error',
  },
};

module.exports = config;
