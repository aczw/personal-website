/** @type {import("prettier").Config & import("prettier-plugin-tailwindcss").PluginOptions} */
const config = {
  plugins: ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
  printWidth: 100,
  tailwindFunctions: ["cn", "clsx", "twMerge"],
};

// I install both Astro and Prettier's official VSC extensions but only use Prettier
// for formatting. this also means I manually install all Prettier plugins (even though
// extensions like Astro already provide it.
export default config;
