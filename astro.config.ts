import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";
import { defineConfig } from "astro/config";

import { readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * @see https://github.com/withastro/astro/issues/3682#issuecomment-1492468918
 */
function projectRoutes() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const directoryPath = path.join(__dirname, "src", "content", "write-ups");
  const files = readdirSync(directoryPath);
  const urls = files.map((file) => {
    const fileName = file.split(".")[0];
    return `https://charleszw.com/${fileName}`;
  });

  return urls;
}

const config = defineConfig({
  site: "https://charleszw.com",
  integrations: [
    sitemap({
      customPages: projectRoutes(),
      lastmod: new Date(),
    }),
    mdx(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  output: "server",
  adapter: vercel({
    imageService: true,
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
