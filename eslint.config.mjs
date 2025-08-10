import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import { configs as tsConfigs } from "typescript-eslint";
import path from "node:path";
import { fileURLToPath } from "node:url";
import globals from "globals";
import nextPlugin from "@next/eslint-plugin-next";
import reactHooks from "eslint-plugin-react-hooks";
import reactPlugin from "eslint-plugin-react";
import importPlugin from "eslint-plugin-import";
import unusedImportsPlugin from "eslint-plugin-unused-imports";
import tsParser from "@typescript-eslint/parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

const config = [
  js.configs.recommended,
  ...tsConfigs.recommended,
  ...fixupConfigRules(
    compat.extends(
      "plugin:react/recommended",
      "plugin:react/jsx-runtime",
      "plugin:react-hooks/recommended",
      "plugin:prettier/recommended",
      "plugin:import/recommended",
      "plugin:import/typescript",
      "next/core-web-vitals",
    ),
  ),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/out/**",
      "**/coverage/**",
      "**/build/**",
      "**/dist/**",
      "**/package.json",
      "**/package-lock.json",
      "**/eslint.config.mjs",
      "**/next.config.js",
      "src/utils/attempt2.js",
      "src/utils/inapp.js",
      "src/utils/externalLinkOpener.js",
      "src/utils/browserEscape.js",
    ],
    plugins: {
      "react-hooks": fixupPluginRules(reactHooks),
      react: fixupPluginRules(reactPlugin),
      import: fixupPluginRules(importPlugin),
      "unused-imports": fixupPluginRules(unusedImportsPlugin),
      next: nextPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      ecmaVersion: 2018,
      sourceType: "module",
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      "import/resolver": {
        node: {
          paths: ["src"],
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
      react: {
        version: "detect",
      },
    },
    rules: {
      "prettier/prettier": ["off", { singleQuote: true }],
      "no-use-before-define": ["off", { functions: false, classes: false }],
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "parameter",
          format: ["camelCase", "PascalCase"],
          leadingUnderscore: "allow",
        },
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE", "PascalCase"],
          leadingUnderscore: "allow",
        },
      ],
      "import/no-extraneous-dependencies": [
        "error",
        {
          devDependencies: true,
          optionalDependencies: false,
          peerDependencies: false,
        },
      ],
      "@typescript-eslint/default-param-last": "off",
      "@typescript-eslint/no-use-before-define": "off",
      "comma-dangle": "off",
      "@typescript-eslint/comma-dangle": "off",
      "import/prefer-default-export": "off",
      "unused-imports/no-unused-imports": "warn",
      "max-len": ["warn", { code: 140, ignorePattern: "^import .*| className=*|background=*", ignoreStrings: true }],
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", ["sibling", "parent"], "index", "type"],
          alphabetize: { order: "desc", caseInsensitive: true },
          pathGroups: [
            { pattern: "components", group: "internal" },
            { pattern: "components/**", group: "internal" },
            { pattern: "constants/**", group: "internal" },
            { pattern: "common", group: "internal" },
            { pattern: "error/**", group: "internal" },
            { pattern: "hooks/**", group: "internal" },
            { pattern: "locale/**", group: "internal" },
            { pattern: "routes/**", group: "internal" },
            { pattern: "selectors", group: "internal" },
            { pattern: "store", group: "internal" },
          ],
          "newlines-between": "always",
        },
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "react/prop-types": "off",
      "react/require-default-props": "off",
      "import/no-unresolved": "off",
      "import/no-cycle": ["off", { maxDepth: "∞" }],
      "@typescript-eslint/no-shadow": "off",
      "no-shadow": "off",
      "no-console": "off",
      "no-plusplus": "off",
      "react-hooks/exhaustive-deps": "off",
      "react/jsx-filename-extension": "off",
      "react/jsx-props-no-spreading": "off",
      "class-methods-use-this": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "@typescript-eslint/no-empty-object-type": "off",
      "react/jsx-sort-props": [
        "error",
        {
          callbacksLast: false,
          shorthandFirst: false,
          shorthandLast: false,
          ignoreCase: true,
          noSortAlphabetically: false,
          reservedFirst: false,
        },
      ],
      quotes: ["error", "double", { avoidEscape: false, allowTemplateLiterals: false }],
    },
  },
];

export default config;
