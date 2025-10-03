import type { CollectionEntry } from "astro:content";

import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import type { PROJECT_CATEGORIES } from "@/scripts/constants";

/**
 * This value is used in astro.config.ts, which unfortunately means it can't
 * share a file with functions that deal with Astro components/JSX syntax,
 * e.g. constants.ts. Therefore it's defined in this file instead.
 */
const SITE_URL = "https://charleszw.com";

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
    return `${SITE_URL}/posts/${fileName}`;
  });

  const projectUrls = readdirSync(join(contentPath, "projects")).map((file) => {
    const fileName = file.split(".")[0];
    return `${SITE_URL}/projects/${fileName}`;
  });

  return [...postUrls, ...projectUrls];
}

/**
 * Checks that the cover image for my project covers have an aspect ratio of
 * 16:10, for no real reason other than consistency and aesthetics
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

/**
 * @returns Full month, day, year.
 */
function getShortDateFormatting(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York",
  });
}

/**
 * @returns Full month, day, year, 12-hour time with timezone.
 */
function getFullDateFormatting(date: Date) {
  return date.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZone: "America/New_York",
    timeZoneName: "short",
  });
}

/**
 * @returns Just the (full) month and year.
 */
function getMonthYearDateFormatting(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    timeZone: "America/New_York",
  });
}

function getProjectsInCategory(
  projects: CollectionEntry<"projects">[],
  category: (typeof PROJECT_CATEGORIES)[number],
  sort = true,
) {
  const filtered = projects.filter((project) => project.data.type === category);

  if (sort) {
    return filtered.sort((a, b) => a.data.order - b.data.order);
  } else {
    return filtered;
  }
}

export {
  SITE_URL,
  getContentRoutes,
  validProjectCover,
  stripEndingSlash,
  getShortDateFormatting,
  getFullDateFormatting,
  getMonthYearDateFormatting,
  getProjectsInCategory,
};
