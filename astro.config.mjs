import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";

const config = defineConfig({
  site: "https://charl.sh",
  integrations: [
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

export default config;
