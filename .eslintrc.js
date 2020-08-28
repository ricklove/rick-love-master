module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json',
    },
    globals: {
        graphql: true,
        __PATH_PREFIX__: true,
        __BASE_PATH__: true, // this will rarely, if ever, be used by consumers
    },
    plugins: [
        `@typescript-eslint`,
        `eslint-comments`,
        `import-quotes`,
        `promise`,
        `unicorn`,
        // `custom-rules`,
    ],
    extends: [
        `airbnb-typescript`,
        `eslint-config-react-app`,
        `plugin:@typescript-eslint/recommended`,
        `plugin:eslint-comments/recommended`,
        `plugin:promise/recommended`,
        `plugin:unicorn/recommended`,
        `prettier`,
        `prettier/react`,
        `prettier/@typescript-eslint`,
    ],
    rules: {
        // Always Use Named Exports
        "import/prefer-default-export": "off",
        "import/no-default-export": "error",

        // Sometimes it's useful to keep props especially when passing through to a nested component
        "react/destructuring-assignment": "off",

        // For Typescript only .tsx, for Javascript either
        "react/jsx-filename-extension": [2, { "extensions": [".js", ".jsx", ".tsx"] }],

        // Need to disable because of not supporting module level const arrow functions
        // However, typescript itself will check this, so still safe
        "no-use-before-define": ["off"],

        // Many Functions should use an inferred return type
        "@typescript-eslint/explicit-function-return-type": [
            "off",
        ],

        // Allow common abbreviates like: e, err, props, args, len
        "unicorn/prevent-abbreviations": "off",

        // Allow return undefined
        "unicorn/no-useless-undefined": "off",

        // Allow return null
        "unicorn/no-null": "off",

        // Allow nested ternary
        "unicorn/no-nested-ternary": "off",

        // Allow Disable ESLint Rule for whole file
        "eslint-comments/disable-enable-pair": ["error", { "allowWholeFile": true }],

        // Yes, of course we use continue with loops
        "no-continue": "off",

        // Always use semicolon
        "semi": ["error", "always"],

        // Single line at end of file, no multiple blank lines over 2
        "eol-last": ["error", "always"],
        "no-multiple-empty-lines": ["error", { "max": 2, "maxEOF": 0 }],

        // Always Comma Dangle with multiline
        "comma-dangle": ["error", {
            "arrays": "always-multiline",
            "objects": "always-multiline",
            "imports": "always-multiline",
            "exports": "always-multiline",
            "functions": "always-multiline",
        }],

        // Use semicolons for multiline types, comma for single line types
        "@typescript-eslint/member-delimiter-style": ["error", {
            "multiline": {
                "delimiter": "semi",
                "requireLast": true
            },
            "singleline": {
                "delimiter": "comma",
                "requireLast": false
            }
        }],

        // Normal Backticks Everywhere (except jsx and imports)

        // Normal quotes must be disabled because typescript types must use single
        "quotes": ["off", "backtick"],
        "@typescript-eslint/quotes": ["error", "backtick"],
        "jsx-quotes": ["error", "prefer-single"],
        "import-quotes/import-quotes": ["error", "single"],

        "react/jsx-props-no-spreading": ["off"],

        // Underscores are useful for long names, allow them
        "camelcase": ['off'],
        "@typescript-eslint/camelcase": ['off'],
        "react/jsx-pascal-case": ['off'],
        "no-underscore-dangle": ['off'],

        // This is not a problem when using semicolons, allow
        "no-plusplus": ['off'],

        // Disagree with rule, substr is preferred for strings
        "unicorn/prefer-string-slice": ["off"],

        // Disagree, it's bettero to keep the functions close to usage
        "unicorn/consistent-function-scoping": ["off"],

        // Always Return await!
        // V8 actually performs better if it is always there
        // Debug Stack is complete
        // Try Catch won't fail
        // Code consistently marks every promise with await (which helps with the common, oops forgot to call await for Promise<void>)
        // The original rule is the opposite: Runtime performance is actually better with await always
        "no-return-await": "off",
        "@typescript-eslint/return-await": ["error", "always"],
        "@typescript-eslint/no-floating-promises": ["error", { ignoreIIFE: true }],
        // This is not needed because of above, promises can return a value sometimes without an await, but all promises must be awaited (above)
        // Use Promise.resolve(if needed)
        "require-await": "off",
        "@typescript-eslint/require-await": ["off"],

        // Not Needed with Typescript
        "react/prop-types": ["off"],

        // Too many weird false positives:
        "react-hooks/exhaustive-deps": ["off"],

        // Too strict
        "no-param-reassign": ['off'],
    },
}