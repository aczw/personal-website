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
 * Order matters! Project videos will be played in the order defined here.
 */
const HOMEPAGE_PROJECTS = [
  "mini-minecraft",
  "cuda-path-tracer",
  "webgpu-clustered",
  "door",
];
const DISABLED_PROJECTS = [
  "dgdg",
  "deth",
  "fireball",
  "moore-chair",
  "webgpu-clustered",
  "glsl-path-tracer",
];
const WIDE_PROJECTS = [
  "cuda-path-tracer",
  "door",
  "pbr-renderer",
  "catanks",
  "rcw",
];

const DitherMode = {
  NOISE: 0,
  ORDERED: 1,
} as const;

const BayerMatrixSize = {
  TWO_BY_TWO: 0,
  FOUR_BY_FOUR: 1,
  EIGHT_BY_EIGHT: 2,
} as const;

export {
  CDN_URL,
  VALID_MONTHS,
  HOMEPAGE_PROJECTS,
  DISABLED_PROJECTS,
  WIDE_PROJECTS,
  DitherMode,
  BayerMatrixSize,
};
