/** @type {import("prettier-plugin-tailwindcss").PluginOptions} */
const config = {
  plugins: [ "prettier-plugin-tailwindcss" ],
  singleAttributePerLine: true,
  tailwindFunctions: [ "cn", "clsx", "twMerge" ],
};

export default config;
