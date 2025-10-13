import type { Config } from "prettier";
import type { PluginOptions } from "prettier-plugin-tailwindcss";

const config: Config & PluginOptions = {
  plugins: ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
  experimentalTernaries: true,
  printWidth: 80,
  proseWrap: "never",
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
    {
      files: "*.jsonc",
      options: {
        // See https://github.com/prettier/prettier/issues/15956
        trailingComma: "none",
      },
    },
  ],
  tailwindStylesheet: "./src/styles/main.css",
  tailwindAttributes: ["tw"],
};

export default config;
