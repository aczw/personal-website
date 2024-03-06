import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";
import { defineConfig } from "astro/config";

const config = defineConfig({
  site: "https://charl.sh",
  integrations: [
    sitemap(),
    mdx(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  output: "server",
  adapter: vercel({
    imageService: true,
    functionPerRoute: true,
    webAnalytics: {
      enabled: true,
    },
  }),
  // see https://noahflk.com/blog/trailing-slashes-astro
  trailingSlash: "never",
  markdown: {
    shikiConfig: {
      theme: "catppuccin-mocha",
    },
  },
  redirects: {
    "/resume": {
      status: 307,
      destination: "/_files/resume.pdf",
    },
  },
});

export default config;
