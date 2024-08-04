import { defineConfig } from "astro/config";

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";

import { existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SITE_NAME = "https://charleszw.com";

/**
 * Astro's sitemap integration does not include dynamic routes in the generated sitemap when
 * the site uses SSR. This function crawls the filesystem and does it manually.
 *
 * @see https://github.com/withastro/astro/issues/3682#issuecomment-1492468918
 */
function contentRoutes() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const contentPath = join(__dirname, "src", "content");
  const postsPath = join(contentPath, "posts");
  if (!existsSync(postsPath)) {
    throw new Error(
      `contentRoutes(): The posts content directory "${postsPath}" does not exist!\n`,
    );
  }

  const postUrls = readdirSync(postsPath).map((file) => {
    const fileName = file.split(".")[0];
    return `${SITE_NAME}/posts/${fileName}`;
  });

  return postUrls;
}

const config = defineConfig({
  site: SITE_NAME,
  integrations: [
    sitemap({
      customPages: contentRoutes(),
    }),
    mdx(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  output: "server",
  adapter: vercel({
    imageService: true,
    imagesConfig: {
      domains: [],
      formats: ["image/avif", "image/webp"],
      sizes: [80, 96, 144, 160, 196, 240, 256, 320, 384, 480, 496, 520, 640, 768, 850],
    },
    webAnalytics: {
      enabled: true,
    },
    includeFiles: [
      "./public/_fonts/AtkinsonHyperlegible-Regular.ttf",
      "./public/_fonts/AtkinsonHyperlegible-Bold.ttf",
    ],
  }),
  // see https://noahflk.com/blog/trailing-slashes-astro
  trailingSlash: "never",
  markdown: {
    shikiConfig: {
      theme: "rose-pine-moon",
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
