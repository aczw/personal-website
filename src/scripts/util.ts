import type { ContentDateType, DateKind } from "@/scripts/types";

/**
 * This value is used in astro.config.ts, which unfortunately means it can't
 * share a file with functions that deal with Astro components/JSX syntax,
 * e.g. constants.ts. Therefore it's defined in this file instead.
 */
const SITE_URL = "https://charleszw.com";

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

function getDateKind(date: ContentDateType): DateKind {
  if (typeof date === "object" && "from" in date) {
    return { kind: "ranged", date };
  } else {
    return { kind: "simple", date };
  }
}

function saturate(value: number) {
  return Math.max(Math.min(value, 1), 0);
}

export {
  SITE_URL,
  validProjectCover,
  stripEndingSlash,
  getShortDateFormatting,
  getFullDateFormatting,
  getMonthYearDateFormatting,
  getDateKind,
  saturate,
};
