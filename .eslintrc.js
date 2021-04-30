module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json',
    },
    plugins: [
        '@typescript-eslint',
        `import-quotes`,
        'jest',
    ],
    extends: [
        'eslint:recommended',
        // 'plugin:prettier/recommended',
        'plugin:@typescript-eslint/recommended',
        // 'prettier',
    ],
    env: {
        es6: true,
        jest: true,
        browser: true,
        node: true,
    },
    rules: {
        "semi": "off",
        "@typescript-eslint/semi": ["error"],

        "@typescript-eslint/explicit-module-boundary-types": "off",

        "comma-dangle": ["error", {
            "arrays": "always-multiline",
            "objects": "always-multiline",
            "imports": "always-multiline",
            "exports": "always-multiline",
            "functions": "always-multiline",
        }],
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

        // "object-property-newline": ["error"],
        "object-curly-newline": ["error", { "multiline": true }],
        "object-curly-spacing": "off",
        "@typescript-eslint/object-curly-spacing": ["error", "always"],
        "array-element-newline": ["error", { "ArrayExpression": "consistent", }],
        "array-bracket-spacing": ["error", "never"],

        "@typescript-eslint/type-annotation-spacing": "error",
        "@typescript-eslint/brace-style": ["error", "1tbs", { "allowSingleLine": true }],
        // "max-statements-per-line": ["error", { "max": 2 }],

        "eol-last": ["error", "always"],
        "no-trailing-spaces": "error",
        "no-multiple-empty-lines": "error",

        "no-tabs": "error",

        "indent": "off",
        "@typescript-eslint/indent": ["error", 4, {
            ignoredNodes: ['TSTypeParameterInstantiation']
        }],

        "comma-spacing": "off",
        "@typescript-eslint/comma-spacing": ["error"],

        "dot-notation": "off",
        "@typescript-eslint/dot-notation": ["error"],

        "keyword-spacing": "off",
        "@typescript-eslint/keyword-spacing": ["error"],

        "func-call-spacing": "off",
        "@typescript-eslint/func-call-spacing": ["error", "never"],

        "space-before-function-paren": "off",
        "@typescript-eslint/space-before-function-paren": ["error", {
            "anonymous": "never",
            "named": "never",
            "asyncArrow": "always"
        }],

        "space-in-parens": "error",

        "key-spacing": "error",
        "no-multi-spaces": "error",
        "space-unary-ops": "error",
        "space-infix-ops": ["error", { "int32Hint": false }],
        "arrow-spacing": "error",
        "semi-spacing": ["error", { "before": false, "after": true }],

        // Normal Backticks Everywhere (except jsx and imports)
        "quotes": "off",
        "@typescript-eslint/quotes": ["error", "backtick"],
        "jsx-quotes": ["error", "prefer-single"],
        "import-quotes/import-quotes": ["error", "single"],

        "react/jsx-props-no-spreading": ["off"],

        // async-await
        "@typescript-eslint/no-misused-promises": ["error"],
        "no-return-await": "off",
        "@typescript-eslint/return-await": ["error", "always"],
        "@typescript-eslint/no-floating-promises": ["error", { ignoreIIFE: true }],

        "@typescript-eslint/no-explicit-any": ["error"],
        "@typescript-eslint/no-var-requires": ["error"],
        "@typescript-eslint/no-empty-function": ["error"],
        "no-useless-escape": "error",
        "max-len": ["warn", {
            code: 120,
            ignoreComments: true,
            ignoreStrings: true,
            ignoreTemplateLiterals: true,
            tabWidth: 4,
        }],
        "no-useless-catch": "error",

        // Need to disable because of not supporting module level const arrow functions
        // However, typescript itself will check this, so still safe
        "no-use-before-define": ["off"],
        "@typescript-eslint/no-use-before-define": ["off"],

        // Many Functions should use an inferred return type
        "@typescript-eslint/explicit-function-return-type": [
            "off",
        ],

        "camelcase": "off",
        "@typescript-eslint/camelcase": ["off"],
    },
};
