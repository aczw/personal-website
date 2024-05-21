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
        // whatever width + px-4 (1rem on either side = 30px)
        wide: "940px",
        narrow: "780px",
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
        xxs: "375px",
        xs: "475px",
        wide: "940px",
      },
      keyframes: {
        fade: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        fade: "fade 0.4s ease-out calc(var(--order) * 90ms) backwards",
      },
    },
  },
  plugins: [],
} satisfies Config;
