import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin";


/** See https://eslint.org/docs/latest/use/configure/ **/
/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/index.js"], languageOptions: {sourceType: "script"}},
  {
    ignores: ["**/cdk.out/**", "**/node_modules/**", "**/*.js"] // acts as global ignores, due to the absence of other properties
  },
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      "@stylistic": stylistic
    },
    rules: {
      "@stylistic/indent": ["error", 2],
      "@stylistic/quotes": ["error", "double", {avoidEscape: true}],
      "@stylistic/semi": ["error", "always"],
      "@stylistic/space-in-parens": ["error", "never"],
      // '@stylistic/space-infix-ops': 'error',
      // '@stylistic/space-unary-ops': ['error', {words: true, nonwords: false}],
      "@stylistic/space-before-blocks": "error",
      "@stylistic/space-before-function-paren": ["error", "never"],
    }
  }
];
