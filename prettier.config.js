/** @type {import("prettier").Config} */
const config = {
  plugins: ["prettier-plugin-tailwindcss"],
  singleAttributePerLine: true,
  overrides: [
    {
      files: ["pnpm-lock.yaml", "package.json"],
      options: {
        rangeEnd: 0,
      },
    },
  ],
};

export default config;
