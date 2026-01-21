import { defineConfig, envField } from "astro/config";

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";

import tailwindcss from "@tailwindcss/vite";

import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import astroExpressiveCode, { setAlpha } from "astro-expressive-code";

import remarkMath from "remark-math";
import rehypeMathjax from "rehype-mathjax/chtml";
import rehypeUnwrapImages from "rehype-unwrap-images";
import getReadingTime from "reading-time";
import { toString } from "mdast-util-to-string";

import { SITE_URL } from "./src/scripts/util";

const config = defineConfig({
  site: SITE_URL,
  output: "static",
  trailingSlash: "never",
  adapter: vercel({
    imageService: true,
    // Required for OG image generation
    includeFiles: [
      "./public/_files/fonts/og/AtkHypNext-Regular.ttf",
      "./public/_files/fonts/og/AtkHypNext-SemiBold.ttf",
    ],
  }),
  image: {
    responsiveStyles: true,
    layout: "constrained",
  },
  integrations: [
    sitemap(),
    astroExpressiveCode({
      plugins: [pluginCollapsibleSections()],
      themes: ["rose-pine", "rose-pine-dawn"],

      useThemedSelectionColors: true,
      useThemedScrollbars: false,
      cascadeLayer: "ec",

      defaultProps: {
        collapseStyle: "collapsible-auto",
      },

      frames: {
        showCopyToClipboardButton: false,
      },

      styleOverrides: {
        borderWidth: "0px",
        borderRadius: "var(--radius-xl)",
        uiFontFamily: "Atkinson Hyperlegible Next",
        uiFontSize: "1rem",
        codeFontFamily: "Maple Mono",
        codeFontSize: "var(--text-mono)",

        frames: {
          editorActiveTabBackground: ({ theme }) =>
            theme.colors["editor.background"],
          editorTabBarBackground: ({ theme }) =>
            setAlpha(theme.colors["editor.background"], 0.5),
          shadowColor: "transparent",
        },
      },
    }),
    mdx(),
  ],
  markdown: {
    rehypePlugins: [
      rehypeUnwrapImages,
      [
        rehypeMathjax,
        {
          chtml: {
            scale: 1.1,
            fontURL:
              "https://cdn.jsdelivr.net/npm/mathjax@3/es5/output/chtml/fonts/woff-v2",
          },
        },
      ],
    ],
    remarkPlugins: [
      remarkMath,
      () =>
        // Adapted from https://docs.astro.build/en/recipes/reading-time
        function (tree, { data }) {
          const textOnPage = toString(tree);
          const readingTime = getReadingTime(textOnPage);

          // @ts-expect-error: Astro object is guaranteed to exist
          data.astro.frontmatter.stats = readingTime;
        },
    ],
  },
  env: {
    schema: {
      LASTFM_API_KEY: envField.string({
        context: "server",
        access: "secret",
        optional: false,
      }),
    },
  },
  redirects: {
    "/resume": {
      status: 307,
      destination: "/_files/resume.pdf",
    },
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: ["bore.pub"],
    },
  },
});

export default config;
