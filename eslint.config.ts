import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import eslintPluginAstro from "eslint-plugin-astro";
import * as mdx from "eslint-plugin-mdx";

export default defineConfig([
  {
    ignores: ["**/node_modules", "**/.astro"],
  },

  // Default ESLint configs
  eslint.configs.recommended,

  // Extend ESLint for TypeScript
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // Extend ESLint for Astro
  ...eslintPluginAstro.configs.recommended,

  // Disable TypeScript linting inside Astro files for now.
  // See https://github.com/ota-meshi/eslint-plugin-astro/issues/447
  {
    files: ["**/*.astro"],
    extends: [tseslint.configs.disableTypeChecked],
  },

  // Extend ESLint for MDX
  {
    ...mdx.flat,
    processor: mdx.createRemarkProcessor({
      lintCodeBlocks: true,
    }),
  },
  {
    ...mdx.flatCodeBlocks,
    rules: {
      ...mdx.flatCodeBlocks.rules,
    },
  },
]);
