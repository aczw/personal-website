import { defineConfig, envField, fontProviders } from "astro/config";

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import { satteri } from "@astrojs/markdown-satteri";
import { unified } from "@astrojs/markdown-remark";

import tailwindcss from "@tailwindcss/vite";

import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import astroExpressiveCode, { setAlpha } from "astro-expressive-code";

import remarkMath from "remark-math";
import rehypeMathjax from "rehype-mathjax/chtml";
import rehypeUnwrapImages from "rehype-unwrap-images";

import { SITE_URL } from "./src/scripts/util";
import { satteriUnwrapImagesPlugin } from "@/scripts/satteri-plugins";

const config = defineConfig({
  site: SITE_URL,
  output: "static",
  trailingSlash: "never",
  adapter: vercel({
    imageService: true,
  }),
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Atkinson Hyperlegible Next",
      cssVariable: "--font-atkinson",
      weights: [400, 700],
      styles: ["normal", "italic"],
      subsets: ["latin"],
      fallbacks: ["sans-serif"],
      formats: ["woff2"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "Atkinson Hyperlegible Next",
      cssVariable: "--font-atkinson-og",
      weights: [400, 600],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: [],
      formats: ["woff"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "Maple Mono",
      cssVariable: "--font-maple",
      weights: [400, 700],
      styles: ["normal", "italic"],
      fallbacks: ["monospace"],
      formats: ["woff2"],
    },
  ],
  image: {
    responsiveStyles: true,
    layout: "constrained",
    remotePatterns: [
      { protocol: "https", hostname: "cdn.charleszw.com", pathname: "/**" },
      {
        protocol: "https",
        hostname: "lastfm-img.freetls.fastly.net",
        pathname: "/**",
      },
      { protocol: "https", hostname: "**.anilist.co", pathname: "/**" },
    ],
    service: {
      entrypoint: "astro/assets/services/sharp",
      config: {
        jpeg: { mozjpeg: true },
      },
    },
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
    processor: satteri({
      hastPlugins: [satteriUnwrapImagesPlugin],
      features: {
        math: true,
        smartPunctuation: true,
      },
    }),
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
    plugins: [tailwindcss({ optimize: { minify: true } })],
    server: {
      allowedHosts: ["bore.pub"],
    },
  },
});

export default config;
