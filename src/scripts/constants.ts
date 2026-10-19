const SITE_URL = "https://charleszw.com";
const CDN_URL = "https://cdn.charleszw.com";

const VALID_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Order matters! Project videos will be played in the order defined.
 * There are exactly three tiles on the homepage which is enforced here.
 */
const HOMEPAGE_PROJECTS = [
  "cuda-pt",
  "catanks",
  "mini-minecraft",
] as const satisfies readonly [string, string, string];

const ICON_SIZE = 16;

export { SITE_URL, CDN_URL, VALID_MONTHS, HOMEPAGE_PROJECTS, ICON_SIZE };
