import { fixupPluginRules } from '@eslint/compat';
import nextPlugin from '@next/eslint-plugin-next';
import prettierConfig from 'eslint-config-prettier';
import neverthrowPlugin from 'eslint-plugin-neverthrow';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import tailwindcssPlugin from 'eslint-plugin-tailwindcss';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores([
    '**/.next/',
    '**/node_modules/',
    '**/.open-next/',
    '**/.vercel/',
    '**/.wrangler/',
  ]),

  // ======================================================
  // TypeScript 関連
  // ======================================================
  tseslint.configs.recommendedTypeChecked,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.json'],
      },
    },
    rules: {
      // @typescript-eslintを使用
      'no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-expressions': 'error',
      // 未使用変数の警告（引数は_で始まる場合は無視）
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

      // Any型の使用を禁止
      '@typescript-eslint/no-explicit-any': 'error',
      // 返り値の省略を許容
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      // 型インポートの使用を推奨(型と値のimport分離)
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { fixStyle: 'separate-type-imports' },
      ],
      // Switch文の全検査を必須に
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      // 型定義はinterfaceよりtype aliasを推奨
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    },
  },

  // ======================================================
  // React 関連
  // ======================================================
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['**/*.tsx'],
    plugins: {
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      ...reactHooksPlugin.configs.recommended.rules,

      // ReactのPropTypesの使用を禁止
      'react/prop-types': 'off',
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
    },
  },

  // ======================================================
  // Next.js 関連
  // ======================================================
  {
    files: ['**/*.tsx'],
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,

      // img要素の使用を禁止
      '@next/next/no-img-element': 'error',
      // Next.jsのリンクの使用を強制
      '@next/next/no-html-link-for-pages': ['error', ['app', 'src']],
    },
  },

  // ======================================================
  // Tailwind CSS 関連
  // ======================================================
  {
    files: ['**/*.tsx'],
    plugins: {
      tailwindcss: tailwindcssPlugin,
    },
    rules: {
      // クラス名順序を警告
      'tailwindcss/classnames-order': 'warn',
      // 略記法の使用を推奨
      'tailwindcss/enforces-shorthand': 'warn',
      // 複数の同じクラス名の使用を警告
      'tailwindcss/no-contradicting-classname': 'warn',
      // 不必要な任意の値の使用を警告
      'tailwindcss/no-unnecessary-arbitrary-value': 'warn',
    },
  },

  // ======================================================
  // neverthrow 関連
  // ======================================================
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      eslintPluginNeverthrow: fixupPluginRules(neverthrowPlugin),
    },
    rules: {
      'eslintPluginNeverthrow/must-use-result': 'error',
    },
  },

  // ======================================================
  // unused-imports 関連
  // ======================================================
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      'unused-imports': unusedImportsPlugin,
    },
    rules: {
      // 未使用importの削除を推奨
      'unused-imports/no-unused-imports': 'warn',
    },
  },

  // ======================================================
  // スタイル・共通ルール
  // ======================================================
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // consoleが残っていればwarn
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
    },
  },

  // ======================================================
  // Prettier Config
  // ======================================================
  prettierConfig,
]);
