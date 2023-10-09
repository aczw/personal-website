import { type Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    fontFamily: {
      sans: ["Atkinson Hyperlegible", ...defaultTheme.fontFamily.sans],
      mono: ["Maple Mono", ...defaultTheme.fontFamily.mono],
    },
    extend: {
      spacing: {
        header: "88px",
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
        xs: "475px",
      },
      keyframes: {
        slide: {
          "0%": { transform: "translateY(25px)" },
          "100%": { transform: "translateY(0px)" },
        },
        fade: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        appear:
          "slide 0.3s ease-out var(--animation-delay) backwards, fade 0.25s ease-out var(--animation-delay) backwards",
        "fade-in": "fade 0.25s ease-out backwards",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
