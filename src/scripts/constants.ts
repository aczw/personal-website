import {
  BayerMatrixSize,
  DitherMode,
  type Color,
  type DitherSettings,
} from "@/scripts/dither/types";

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

/**
 * Corresponds to CSS var(--color-sweater-8).
 */
const SWEATER_8: Color = {
  r: 0.19215686274509805,
  g: 0.17647058823529413,
  b: 0.396078431372549,
};

/**
 * Corresponds to CSS var(--color-sweater-10).
 */
const SWEATER_10: Color = {
  r: 0.0392156862745098,
  g: 0.03529411764705882,
  b: 0.09803921568627451,
};

const DEFAULT_DITHER_SETTINGS: DitherSettings = {
  general: {
    mode: DitherMode.ORDERED,
    uvPixelSize: 32,
    numQuantizedColors: 5,
    bias: 0.0,
  },
  color: {
    a: SWEATER_10,
    b: SWEATER_8,
  },
  ordered: {
    bayerMatrixSize: BayerMatrixSize.EIGHT_BY_EIGHT,
    ditheredSize: 4,
  },
};

export {
  CDN_URL,
  VALID_MONTHS,
  HOMEPAGE_PROJECTS,
  DISABLED_PROJECTS,
  WIDE_PROJECTS,
  SWEATER_8,
  SWEATER_10,
  DEFAULT_DITHER_SETTINGS,
};
