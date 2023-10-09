import { type Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      ...defaultTheme.fontFamily,
      fontFamily: {
        sans: ["Atkinson Hyperlegible", ...defaultTheme.fontFamily.sans],
        mono: ["Maple Mono", ...defaultTheme.fontFamily.mono],
      },
      colors: {
        sweater: {
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
      screens: {
        ...defaultTheme.screens,
        xs: "475px",
      },
      keyframes: {
        ...defaultTheme.keyframes,
        slide: {
          "0%": { transform: "translateY(15px)" },
          "100%": { transform: "translateY(0px)" },
        },
        fade: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        ...defaultTheme.animation,
        appear:
          "slide 0.2s ease-out var(--animation-delay) backwards, fade 0.2s ease-out var(--animation-delay) backwards",
        "fade-in": "fade 0.25s ease-out backwards",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
