// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('@rushstack/eslint-config/patch/modern-module-resolution');

module.exports = {
  extends: ['@rushstack/eslint-config/profile/web-app', '@rushstack/eslint-config/mixins/react'],
  parserOptions: { tsconfigRootDir: __dirname },
  settings: {
    react: {
      version: '17.0',
    },
  },
  plugins: ['import-quotes', 'simple-import-sort', 'unused-imports'],
  ignorePatterns: ['lib', '.eslintrc.js'],

  rules: {
    '@rushstack/typedef-var': 'off',
    '@rushstack/no-new-null': 'off',
    'react/jsx-no-bind': 'off',
    eqeqeq: ['error', 'always', { null: 'ignore' }],

    // Naming
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'default',
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        leadingUnderscore: 'allow',
        filter: {
          regex: [
            // This is a special exception for naming patterns that use an underscore to separate two camel-cased
            // parts.  Example:  "aLongName_variant"
            '^_?[a-z0-9]*?([A-Z][a-z0-9]*)+_[a-zA-Z0-9]*$',
          ]
            .map((x) => `(${x})`)
            .join('|'),
          match: false,
        },
      },
      // _camelCase
      {
        selector: 'memberLike',
        modifiers: ['private'],
        format: ['camelCase'],
        leadingUnderscore: 'require',
      },
      // // isBoolean
      // {
      //   selector: 'variable',
      //   types: ['boolean'],
      //   format: ['PascalCase'],
      //   prefix: ['is', 'should', 'has', 'can', 'did', 'will'],
      // },
      // // const CAN_BE_UPPER, or Pascal (React Components)
      // {
      //   selector: 'variable',
      //   modifiers: ['const'],
      //   format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
      // },
      // type P<TStartsWithT>
      {
        selector: 'typeParameter',
        format: ['PascalCase'],
        prefix: ['T'],
      },
      // Type
      {
        selector: 'typeLike',
        format: ['PascalCase'],
        filter: {
          regex: [
            // This is a special exception for naming patterns that use an underscore to separate two camel-cased
            // parts.  Example:  "aLongName_variant"
            '^_?[a-z0-9]*?([A-Z][a-z0-9]*)+_[a-zA-Z0-9]*$',
          ]
            .map((x) => `(${x})`)
            .join('|'),
          match: false,
        },
      },
      // ['@weirdName']
      {
        selector: [
          'classProperty',
          'objectLiteralProperty',
          'typeProperty',
          'classMethod',
          'objectLiteralMethod',
          'typeMethod',
          'accessor',
          'enumMember',
        ],
        format: null,
        modifiers: ['requiresQuotes'],
      },
    ],

    // Backticks Everywhere (except jsx and imports)
    quotes: 'off',
    '@typescript-eslint/quotes': ['error', 'backtick'],
    'jsx-quotes': ['error', 'prefer-single'],
    'import-quotes/import-quotes': ['error', 'single'],

    // Use type for object definitions
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],

    // Allow inferred return types
    '@typescript-eslint/explicit-function-return-type': 'off',

    // Need to disable because of not supporting module level const arrow functions
    // However, typescript itself will check this, so still safe
    'no-use-before-define': ['off'],
    '@typescript-eslint/no-use-before-define': ['off'],

    // Imports
    'simple-import-sort/imports': [
      'error',
      {
        // The default grouping, but with no blank lines.
        groups: [['^\\u0000', '^@?\\w', '^', '^@ricklove', '^\\.']],
      },
    ],
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
    ],

    // async-await
    '@typescript-eslint/no-misused-promises': ['error'],
    'no-return-await': 'off',
    '@typescript-eslint/return-await': ['error', 'always'],
    '@typescript-eslint/no-floating-promises': ['error', { ignoreIIFE: true }],

    '@typescript-eslint/no-explicit-any': ['error'],
    '@typescript-eslint/no-var-requires': ['error'],
    '@typescript-eslint/no-empty-function': ['error'],
    'no-useless-escape': 'error',
    'no-useless-catch': 'error',

    // '@typescript-eslint/explicit-module-boundary-types': 'off',

    // White space
    semi: 'off',
    '@typescript-eslint/semi': ['error'],

    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'always-multiline',
      },
    ],
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'semi',
          requireLast: true,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
      },
    ],

    'object-curly-spacing': 'off',
    '@typescript-eslint/object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],

    // Spacing for types
    '@typescript-eslint/type-annotation-spacing': [
      'error',
      { before: false, after: true, overrides: { arrow: { before: true, after: true } } },
    ],
    '@typescript-eslint/brace-style': ['error', '1tbs', { allowSingleLine: true }],

    'eol-last': ['error', 'always'],
    'no-trailing-spaces': 'error',

    'no-tabs': 'error',

    'comma-spacing': 'off',
    '@typescript-eslint/comma-spacing': ['error'],

    'dot-notation': 'off',
    '@typescript-eslint/dot-notation': ['error'],

    'keyword-spacing': 'off',
    '@typescript-eslint/keyword-spacing': ['error'],

    'func-call-spacing': 'off',
    '@typescript-eslint/func-call-spacing': ['error', 'never'],

    'space-before-function-paren': 'off',
    '@typescript-eslint/space-before-function-paren': [
      'error',
      {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'always',
      },
    ],

    'space-in-parens': 'error',
    'key-spacing': 'error',
    'no-multi-spaces': 'error',
    'space-unary-ops': 'error',
    'space-infix-ops': 'off',
    '@typescript-eslint/space-infix-ops': ['error', { int32Hint: false }],

    'arrow-spacing': 'error',
    'semi-spacing': ['error', { before: false, after: true }],

    // // "max-statements-per-line": ["error", { "max": 2 }],
    // 'no-multiple-empty-lines': 'error',

    // Wrapping & Indentation - handled by prettier
    // 'object-curly-newline': ['error', { multiline: true }],
    // 'array-element-newline': ['error', { ArrayExpression: 'consistent' }],
    // indent: 'off',
    // '@typescript-eslint/indent': [
    //   'error',
    //   1,
    //   {
    //     ignoredNodes: ['TSTypeParameterInstantiation'],
    //   },
    // ],
  },
};
