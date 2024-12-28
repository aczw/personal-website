import { type Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: ["./src/**/*.{astro,html,js,ts,md,mdx}"],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    fontFamily: {
      sans: ["Atkinson Hyperlegible", ...defaultTheme.fontFamily.sans],
      mono: ["Berkeley Mono Variable", ...defaultTheme.fontFamily.mono],
    },
    extend: {
      // Account for 2rem (30px) padding on sides, so <width> + 2 * 30px
      maxWidth: {
        normal: "710px",
        wide: "960px",
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
        // We need to know screen size so the hashtags next to MDX headings can be shifted
        // to the right when the screen width becomes too small
        normal: "710px",
        post: "710px",
        "560": "560px",
        xs: "480px",
        "380": "380px",
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
      cursor: {
        mewo: 'url("/src/assets/mewo.webp") 32 32, not-allowed',
      },
    },
  },
};

export default config;
