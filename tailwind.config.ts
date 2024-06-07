import { type Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    fontFamily: {
      sans: ["Atkinson Hyperlegible", ...defaultTheme.fontFamily.sans],
      mono: ["Berkeley Mono Variable", ...defaultTheme.fontFamily.mono],
    },
    extend: {
      maxWidth: {
        // width + 1.75rem (26.25px) on both sides, so 850px + (2 * 26.25px) = 902.5px
        content: "902.5px",
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
        content: "902.5px",
        post: "710px",
        xs: "480px",
      },
      keyframes: {
        fade: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        fade: "fade 0.4s ease-out calc(var(--order) * var(--fade-speed)) backwards",
      },
    },
  },
  plugins: [],
} satisfies Config;
