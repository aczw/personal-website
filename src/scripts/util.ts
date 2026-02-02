import type { ContentDate, DateKind } from "@/scripts/types";

/**
 * Values used in astro.config.ts can't be defined in files with functions that
 * deal with Astro components/JSX syntax, which includes constants.ts. So
 * some constants are defined in this file instead.
 */
const SITE_URL = "https://charleszw.com";

/**
 * Might change in the future if I move.
 */
const CURRENT_TIMEZONE = "America/New_York";

/**
 * Checks that the cover image for my project covers have an aspect ratio of
 * 16:10, for no real reason other than consistency and aesthetics
 */
function isValidProjectCover(width: number, height: number): boolean {
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
    timeZone: CURRENT_TIMEZONE,
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
    timeZone: CURRENT_TIMEZONE,
    timeZoneName: "short",
  });
}

/**
 * @returns Full month and day.
 */
function getMonthDayDateFormatting(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    timeZone: CURRENT_TIMEZONE,
  });
}

function getDateKind(date: ContentDate): DateKind {
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
  isValidProjectCover,
  stripEndingSlash,
  getShortDateFormatting,
  getFullDateFormatting,
  getMonthDayDateFormatting,
  getDateKind,
  saturate,
};
