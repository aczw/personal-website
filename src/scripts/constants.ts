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

const CURRENT_TIMEZONE = "America/Los_Angeles";

const KEYFRAME_ANIM_OPTS: KeyframeAnimationOptions = {
  duration: 500,
  // https://easings.net/#easeInOutExpo
  easing: "cubic-bezier(0.87, 0, 0.13, 1)",
  fill: "forwards",
};

export {
  SITE_URL,
  CDN_URL,
  VALID_MONTHS,
  HOMEPAGE_PROJECTS,
  ICON_SIZE,
  CURRENT_TIMEZONE,
  KEYFRAME_ANIM_OPTS,
};
