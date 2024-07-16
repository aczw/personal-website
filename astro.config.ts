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

  const changelogPath = join(contentPath, "changelog");
  if (!existsSync(changelogPath)) {
    throw new Error(
      `contentRoutes(): The changelog directory "${changelogPath}" does not exist!\n`,
    );
  }

  const changelogUrls = readdirSync(changelogPath).map((file) => {
    // my version numbering has exactly two periods, so we collect the first three array elements
    const versionPieces = file.split(".").splice(0, 3);
    // remove the "v" because the slug doesn't contain it
    const slug = `${versionPieces[0].slice(1)}.${versionPieces[1]}.${versionPieces[2]}`;
    return `${SITE_NAME}/changelog/${slug}`;
  });

  return [...postUrls, ...changelogUrls];
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
      sizes: [160, 320, 640, 1280, 2560],
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
