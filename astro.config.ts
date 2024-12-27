import { defineConfig, envField } from "astro/config";

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";

import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import astroExpressiveCode, { setAlpha } from "astro-expressive-code";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";

const SITE_NAME = "https://charleszw.com";

/**
 * Astro's sitemap integration does not include dynamic routes in the generated sitemap when
 * the site uses SSR. This function crawls the filesystem and does it manually.
 *
 * Note to self: this also includes routes that are private/drafts.
 *
 * @see https://github.com/withastro/astro/issues/3682#issuecomment-1492468918
 */
function getContentRoutes() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const contentPath = join(__dirname, "src", "content");

  const postUrls = readdirSync(join(contentPath, "posts")).map((file) => {
    const fileName = file.split(".")[0];
    return `${SITE_NAME}/posts/${fileName}`;
  });

  const projectUrls = readdirSync(join(contentPath, "projects")).map((file) => {
    const fileName = file.split(".")[0];
    return `${SITE_NAME}/projects/${fileName}`;
  });

  return [...postUrls, ...projectUrls];
}

const config = defineConfig({
  site: SITE_NAME,
  integrations: [
    sitemap({
      customPages: getContentRoutes(),
    }),
    tailwind({
      applyBaseStyles: false,
    }),
    astroExpressiveCode({
      plugins: [pluginCollapsibleSections()],
      themes: ["rose-pine-moon"],
      useThemedSelectionColors: true,

      styleOverrides: {
        borderWidth: "0px",
        borderRadius: "0.5rem",
        uiFontFamily: "Atkinson Hyperlegible",
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
        },
      },
    }),
    mdx(),
  ],
  output: "static",
  adapter: vercel({
    imageService: true,
    webAnalytics: {
      enabled: true,
    },
    includeFiles: [
      "./public/_fonts/AtkinsonHyperlegible-Regular.woff",
      "./public/_fonts/AtkinsonHyperlegible-Bold.woff",
    ],
  }),
  env: {
    schema: {
      LASTFM_API_KEY: envField.string({ context: "server", access: "secret", optional: false }),
    },
  },
  // See https://noahflk.com/blog/trailing-slashes-astro
  trailingSlash: "never",
  redirects: {
    "/resume": {
      status: 307,
      destination: "/_files/resume.pdf",
    },
  },
});

export default config;
