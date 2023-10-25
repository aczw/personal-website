/** @type {import("prettier").Config & import("prettier-plugin-tailwindcss").PluginOptions} */
const config = {
  plugins: ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
  singleAttributePerLine: true,
  tailwindFunctions: ["cn", "clsx", "twMerge"],
};

export default config;
