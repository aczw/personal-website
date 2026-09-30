import { CURRENT_TIMEZONE, DAY_TO_SECONDS } from "@/scripts/constants";
import type { ContentDate, DateKind } from "@/scripts/types";

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

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const calculateRelativeTime = (
  rtf: Intl.RelativeTimeFormat,
  unixTimestamp: number | null,
): string => {
  if (unixTimestamp === null) return "recently";

  const diffInSeconds = unixTimestamp - Date.now() * 0.001;

  const diffInDays = diffInSeconds / DAY_TO_SECONDS;
  if (diffInDays < -1) return rtf.format(Math.ceil(diffInDays), "day");

  const diffInHours = diffInSeconds / 3600; // Seconds in an hour
  if (diffInHours < -1) return rtf.format(Math.ceil(diffInHours), "hour");

  const diffInMinutes = diffInSeconds / 60; // Seconds in a minute
  if (diffInMinutes < -1) return rtf.format(Math.ceil(diffInMinutes), "minute");

  return rtf.format(Math.ceil(diffInSeconds), "second");
};

export {
  isValidProjectCover,
  stripEndingSlash,
  getShortDateFormatting,
  getFullDateFormatting,
  getMonthDayDateFormatting,
  getDateKind,
  capitalize,
  calculateRelativeTime,
};
