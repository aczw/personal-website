import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";
import { defineConfig, envField } from "astro/config";

import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import astroExpressiveCode, { setAlpha } from "astro-expressive-code";
import rehypeUnwrapImages from "rehype-unwrap-images";

import { SITE_NAME } from "./src/scripts/util";

const config = defineConfig({
  site: SITE_NAME,
  integrations: [
    sitemap(),
    tailwind({
      applyBaseStyles: false,
    }),
    astroExpressiveCode({
      plugins: [pluginCollapsibleSections()],
      themes: ["rose-pine-moon"],
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
        codeFontFamily: "Berkeley Mono Variable",
        codeFontWeight: "120",
        codeFontSize: "13px",

        frames: {
          editorActiveTabBackground: ({ theme }) => theme.colors["editor.background"],
          editorActiveTabForeground: "#C3BDFF",
          editorActiveTabIndicatorHeight: "2px",
          editorActiveTabIndicatorTopColor: "#C3BDFF",
          editorTabBarBackground: ({ theme }) => setAlpha(theme.colors["editor.background"], 0.5),
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
  output: "static",
  adapter: vercel({
    imageService: true,
    includeFiles: ["./public/_fonts/AtkHypNext-Regular.ttf", "./public/_fonts/AtkHypNext-Bold.ttf"],
  }),
  env: {
    schema: {
      LASTFM_API_KEY: envField.string({ context: "server", access: "secret", optional: false }),
    },
  },
  trailingSlash: "never",
  redirects: {
    "/resume": {
      status: 307,
      destination: "/_files/resume.pdf",
    },
  },
});

export default config;
