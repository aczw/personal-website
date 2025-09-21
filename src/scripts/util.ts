import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  FileUserIcon,
  LinkedinIcon,
  GithubIcon,
  MailIcon,
} from "@lucide/astro";

import type { LinkWithIcon } from "@/scripts/types";

const SITE_NAME = "https://charleszw.com";
const CDN_URL = "https://cdn.charleszw.com";

/**
 * Checks that the cover image for my project covers have an aspect ratio of 16:10, for no real
 * reason other than consistency and aesthetics
 */
function validProjectCover(width: number, height: number): boolean {
  const ratio = width / height;

  if (Math.abs(ratio - 1.6) <= 0.01) {
    return true;
  }

  return false;
}

/**
 * @see https://github.com/withastro/astro/issues/5248
 */
function stripEndingSlash(path: string) {
  return path.replace(/\/+$/, "");
}

function getSocials(): LinkWithIcon[] {
  return [
    { href: "/_files/resume.pdf", label: "Resume", icon: FileUserIcon },
    {
      href: "https://linkedin.com/in/zwcharl",
      label: "LinkedIn",
      icon: LinkedinIcon,
    },
    { href: "https://github.com/aczw", label: "GitHub", icon: GithubIcon },
    { href: "mailto:zwcharl@gmail.com", label: "Email", icon: MailIcon },
  ];
}

/**
 * Astro's sitemap integration does not include dynamic routes in the generated sitemap when
 * the site uses SSR. This function crawls the filesystem and does it manually.
 *
 * Note: this also includes routes that are private/drafts, because it does not check frontmatter.
 *
 * Note: currently unused because projects and posts are statically generated since v5.0.0. Check
 * file paths before using.
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

export {
  SITE_NAME,
  CDN_URL,
  getContentRoutes,
  validProjectCover,
  stripEndingSlash,
  getSocials,
};
