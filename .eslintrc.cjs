/** @type {import("eslint").Linter.Config} */
module.exports = {
  env: {
    node: true,
    es2022: true,
    browser: true
  },
  extends: ["eslint:recommended", "plugin:astro/recommended"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  overrides: [
    {
      files: ["*.astro"],
      parser: "astro-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
        extraFileExtensions: [".astro"]
      },
      rules: {}
    },
    {
      files: ["*.ts"],
      parser: "@typescript-eslint/parser",
      extends: ["plugin:@typescript-eslint/recommended"],
      rules: {}
    },
    {
      files: ["*.d.ts"],
      rules: {
        "@typescript-eslint/triple-slash-reference": "off"
      }
    },
    {
      // define the configuration for `<script>` tags.
      // scripts in `<script>` are assigned a virtual file name with the `.js` extension.
      // see https://ota-meshi.github.io/eslint-plugin-astro/user-guide/#parser-configuration
      files: ["**/*.astro/*.js", "*.astro/*.js"],
      parser: "@typescript-eslint/parser"
    },
    {
      files: ["*.md", "*.mdx"],
      parser: "eslint-mdx",
      extends: ["plugin:mdx/recommended"],
      settings: {
        "mdx/code-blocks": true
      },
      rules: {
        "no-unused-vars": "off"
      }
    }
  ]
};