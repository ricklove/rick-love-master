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
        // "import/no-webpack-loader-syntax": [0],
        // // "graphql/template-strings": [
        // //     `error`,
        // //     {
        // //         env: `relay`,
        // //         schemaString: printSchema(schema, { commentDescriptions: true }),
        // //         tagName: `graphql`,
        // //     },
        // // ],
        // // https://github.com/evcohen/eslint-plugin-jsx-a11y/tree/master/docs/rules
        // "jsx-a11y/accessible-emoji": `warn`,
        // "jsx-a11y/alt-text": `warn`,
        // "jsx-a11y/anchor-has-content": `warn`,
        // "jsx-a11y/anchor-is-valid": `warn`,
        // "jsx-a11y/aria-activedescendant-has-tabindex": `warn`,
        // "jsx-a11y/aria-props": `warn`,
        // "jsx-a11y/aria-proptypes": `warn`,
        // "jsx-a11y/aria-role": `warn`,
        // "jsx-a11y/aria-unsupported-elements": `warn`,
        // // TODO: It looks like the `autocomplete-valid` rule hasn't been published yet
        // // "jsx-a11y/autocomplete-valid": [
        // //   "warn",
        // //   {
        // //     inputComponents: [],
        // //   },
        // // ],
        // "jsx-a11y/click-events-have-key-events": `warn`,
        // "jsx-a11y/heading-has-content": `warn`,
        // "jsx-a11y/html-has-lang": `warn`,
        // "jsx-a11y/iframe-has-title": `warn`,
        // "jsx-a11y/img-redundant-alt": `warn`,
        // "jsx-a11y/interactive-supports-focus": `warn`,
        // "jsx-a11y/label-has-associated-control": `warn`,
        // "jsx-a11y/lang": `warn`,
        // "jsx-a11y/media-has-caption": `warn`,
        // "jsx-a11y/mouse-events-have-key-events": `warn`,
        // "jsx-a11y/no-access-key": `warn`,
        // "jsx-a11y/no-autofocus": `warn`,
        // "jsx-a11y/no-distracting-elements": `warn`,
        // "jsx-a11y/no-interactive-element-to-noninteractive-role": `warn`,
        // "jsx-a11y/no-noninteractive-element-interactions": `warn`,
        // "jsx-a11y/no-noninteractive-element-to-interactive-role": `warn`,
        // "jsx-a11y/no-noninteractive-tabindex": `warn`,
        // "jsx-a11y/no-onchange": `warn`,
        // "jsx-a11y/no-redundant-roles": `warn`,
        // "jsx-a11y/no-static-element-interactions": `warn`,
        // "jsx-a11y/role-has-required-aria-props": `warn`,
        // "jsx-a11y/role-supports-aria-props": `warn`,
        // "jsx-a11y/scope": `warn`,
        // "jsx-a11y/tabindex-no-positive": `warn`,

        // Some good rules from: https://github.com/iamturns/create-exposed-app/blob/master/.eslintrc.js
        // Default is bad for sure, but it is required for Gatsby Pages
        "import/prefer-default-export": "off",
        "import/no-default-export": "error",
        // Allow nameless arrow functions: Gatsby Pages
        // "import/no-anonymous-default-export": [2, { "allowArrowFunction": true }],

        // Sometimes useful to do so, and typescript still requires types
        "react/destructuring-assignment": "off",

        // Tsx react only?
        // "react/jsx-filename-extension": [2, { "extensions": [".js", ".jsx", ".tsx"] }],
        // React/ReactNative JS mixed with tsx?
        "react/jsx-filename-extension": [2, { "extensions": [".js", ".jsx", ".tsx"] }],

        // Sometimes doesn't matter
        "no-use-before-define": [
            "error",
            { functions: false, classes: true, variables: true },
        ],
        "@typescript-eslint/no-use-before-define": [
            "error",
            { functions: false, classes: true, variables: true, typedefs: false },
        ],

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

        // Allow Disable ESLint Rule for whole file
        "eslint-comments/disable-enable-pair": ["error", { "allowWholeFile": true }],


        // My Preferences:

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
        // Use semicolons to multiline types, comma for single line types
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
        // Normal Backticks Everywhere except jsx and imports

        // Normal quotes must be disabled because typescript types must use single
        "quotes": ["off", "backtick"],
        "@typescript-eslint/quotes": ["error", "backtick"],
        "jsx-quotes": ["error", "prefer-single"],
        "import-quotes/import-quotes": ["error", "single"],

        "react/jsx-props-no-spreading": ["off"],

        // I want underscores
        "camelcase": ['off'],
        "@typescript-eslint/camelcase": ['off'],
        "react/jsx-pascal-case": ['off'],
        "no-underscore-dangle": ['off'],

        // Why?
        "no-plusplus": ['off'],

        // No substr is preferred 
        "unicorn/prefer-string-slice": ["off"],

        // Keep your functions close to home
        "unicorn/consistent-function-scoping": ["off"],

        // Always Return await!
        // V8 actually performs better if it is always there
        // Debug Stack is complete
        // Try Catch won't fail
        // Code consistently marks every promise with await (which helps with the common, oops forgot to call await for Promise<void>)
        // The original rule is completely wrong
        "no-return-await": "off",
        "@typescript-eslint/return-await": ["error", "always"],
        "@typescript-eslint/no-floating-promises": ["error"],
        // This is not needed because of above, promises can return a value sometimes without an await, but all promises must be awaited (above)
        // Use Promise.resolve(if needed)
        "require-await": "off",
        "@typescript-eslint/require-await": ["off"],


        // TODO: Test
        // "require-atomic-updates": ["error"],
    },
}