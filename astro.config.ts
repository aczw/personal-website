import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";
import astroExpressiveCode, { setAlpha } from "astro-expressive-code";
import rehypeUnwrapImages from "rehype-unwrap-images";

import { SITE_NAME } from "./src/scripts/util";

const config = defineConfig({
  site: SITE_NAME,
  output: "static",
  trailingSlash: "never",
  adapter: vercel({
    imageService: true,
    // Required for OG image generation
    includeFiles: [
      "./public/_files/fonts/og/AtkHypNext-Regular.ttf",
      "./public/_files/fonts/og/AtkHypNext-Bold.ttf",
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
      themes: ["rose-pine"],
      useThemedSelectionColors: true,

      defaultProps: {
        collapseStyle: "collapsible-auto",
      },

      frames: {
        showCopyToClipboardButton: false,
      },

      styleOverrides: {
        borderWidth: "0px",
        borderRadius: "0.5rem",
        uiFontFamily: "Atkinson Hyperlegible Next",
        uiFontSize: "1rem",
        codeFontFamily: "Maple Mono",
        codeFontSize: "var(--text-mono)",

        frames: {
          editorActiveTabBackground: ({ theme }) =>
            theme.colors["editor.background"],
          editorActiveTabForeground: "var(--color-sweater-3)",
          editorActiveTabIndicatorHeight: "2px",
          editorActiveTabIndicatorTopColor: "var(--color-sweater-3)",
          editorTabBarBackground: ({ theme }) =>
            setAlpha(theme.colors["editor.background"], 0.5),
          editorTabBorderRadius: "0.3rem",
          shadowColor: "transparent",
        },

        textMarkers: {
          markBackground: ({ resolveSetting }) =>
            `lch(23.59% 18.75 ${resolveSetting("textMarkers.markHue")} / ${resolveSetting("textMarkers.backgroundOpacity")})`,
          markBorderColor: ({ resolveSetting }) =>
            `lch(23.59% 18.75 ${resolveSetting("textMarkers.markHue")} / ${resolveSetting("textMarkers.borderOpacity")})`,
          markHue: "293.7",
        },

        collapsibleSections: {
          closedBackgroundColor: "#393552",
          openBackgroundColorCollapsible: setAlpha("#393552", 0.4),
        },
      },
    }),
    mdx(),
  ],
  markdown: {
    rehypePlugins: [rehypeUnwrapImages],
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
  },
});

export default config;
