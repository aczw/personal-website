import { type Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

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
  // thank you! https://twitter.com/lepikhinb/status/1707727096083255330
  plugins: [
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          glass: (
            value: string,
            { modifier }: { modifier: string | number | null },
          ) => {
            const offset = modifier ?? value;
            const height = `calc(100% - ${offset})`;

            return {
              "&::before": {
                content: "var(--tw-content)",
                position: "absolute",
                inset: "0",
                bottom: `-${offset}`,
                maskImage: `linear-gradient(to bottom, black 0, black ${height}, transparent ${height})`,
                "--tw-backdrop-blur": `blur(${value})`,
                backdropFilter:
                  "var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)",
              },
            };
          },
        },
        {
          values: theme("blur"),
          modifiers: theme("spacing"),
        },
      );

      matchUtilities(
        {
          "glass-edge": (
            value: string,
            { modifier }: { modifier: string | number | null },
          ) => {
            const offset = modifier ?? value;
            const top = `calc(100% - ${offset} - 1px)`;
            const bottom = `calc(100% - ${offset})`;

            return {
              "&::before": {
                content: "var(--tw-content)",
                position: "absolute",
                inset: "0",
                bottom: `-${offset}`,
                maskImage: `linear-gradient(to bottom, transparent 0, transparent ${top}, black ${top}, black ${bottom}, transparent ${bottom})`,
                "--tw-backdrop-blur": `blur(${value})`,
                "--tw-backdrop-brightness": `brightness(1.5)`,
                "--tw-backdrop-saturate": `saturate(1.5)`,
                backdropFilter:
                  "var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)",
              },
            };
          },
        },
        {
          values: theme("blur"),
          modifiers: theme("spacing"),
        },
      );
    }),
  ],
} satisfies Config;

export default config;
