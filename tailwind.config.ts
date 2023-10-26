import { type Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import { createThemes } from "tw-colors";

const config = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    fontFamily: {
      sans: ["Atkinson Hyperlegible", ...defaultTheme.fontFamily.sans],
      mono: ["Maple Mono", ...defaultTheme.fontFamily.mono],
    },
    extend: {
      spacing: {
        header: "64px",
        footer: "56px",
        prose: "670px",
      },
      screens: {
        xs: "475px",
      },
      keyframes: {
        fade: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        fade: "fade 0.25s ease-out var(--delay) backwards",
      },
    },
  },
  plugins: [
    createThemes(
      {
        sweater: {
          ash: {
            1: "#EAE9FF",
            2: "#D6D3FF",
            3: "#C3BDFF",
            4: "#ADA6FF",
            5: "#9A91FE",
            6: "#6B62CB",
            7: "#484390",
            8: "#312D65",
            9: "#1D193D",
            10: "#0A0919",
          },
        },
      },
      {
        defaultTheme: "sweater",
        strict: true,
        produceThemeClass: (themeName) => `theme-${themeName}`,
      },
    ),
  ],
} satisfies Config;

export default config;
