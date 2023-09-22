import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";

const config = defineConfig({
  integrations: [react(), tailwind()],
  output: "hybrid",
  adapter: vercel({
    imageService: true,
  }),
});

export default config;
