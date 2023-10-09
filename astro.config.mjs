import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";
import { defineConfig } from "astro/config";

// see https://astro.build/config
const config = defineConfig({
  site: "https://charl.sh",
  integrations: [
    sitemap(),
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  output: "hybrid",
  adapter: vercel({
    imageService: true,
  }),
  // see https://noahflk.com/blog/trailing-slashes-astro
  trailingSlash: "never",
});

export default defineConfig(config);
