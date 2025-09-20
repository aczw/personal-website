import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import eslintPluginAstro from "eslint-plugin-astro";
import * as mdx from "eslint-plugin-mdx";

import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

export default defineConfig([
  {
    ignores: ["**/node_modules", "**/.astro"],
  },

  eslint.configs.recommended,
  eslintPluginAstro.configs.recommended,

  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: dirname(fileURLToPath(import.meta.url)),
      },
    },
  },

  {
    ...mdx.flat,
    processor: mdx.createRemarkProcessor({
      lintCodeBlocks: true,
    }),
  },
  mdx.flatCodeBlocks,
]);
