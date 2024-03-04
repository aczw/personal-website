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
});

export default config;
