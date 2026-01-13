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
  "catanks",
  "mini-minecraft",
  "webgpu-clustered",
  "door",
];
const DISABLED_PROJECTS = [
  "cuda-boids",
  "deth",
  "dgdg",
  "fireball",
  "glsl-path-tracer",
  "moore-chair",
  "pbr-renderer",
  "rcw",
];

/**
 * Corresponds to CSS var(--color-sweater-1).
 */
const SWEATER_1: Color = {
  r: 0.8823529411764706,
  g: 0.8745098039215686,
  b: 1.0,
};

/**
 * Corresponds to CSS var(--color-sweater-3).
 */
const SWEATER_3: Color = {
  r: 0.7647058823529411,
  g: 0.7411764705882353,
  b: 1.0,
};

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

const DEFAULT_DARK_DITHER_SETTINGS: DitherSettings = {
  general: {
    mode: DitherMode.ORDERED,
    uvPixelSize: 48,
    numQuantizedColors: 6,
    bias: -0.08,
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

const DEFAULT_LIGHT_DITHER_SETTINGS: DitherSettings = {
  general: {
    mode: DitherMode.ORDERED,
    uvPixelSize: 48,
    numQuantizedColors: 6,
    bias: 0.0,
  },
  color: {
    a: SWEATER_1,
    b: SWEATER_3,
  },
  ordered: {
    bayerMatrixSize: BayerMatrixSize.EIGHT_BY_EIGHT,
    ditheredSize: 4,
  },
};

/**
 * Default icon size unless otherwise specified. Should stay in sync with
 * `var(--spacing-icon)` defined in main.css.
 */
const ICON_SIZE = 18;
const EYE_SIZE = 7;

export {
  CDN_URL,
  VALID_MONTHS,
  HOMEPAGE_PROJECTS,
  DISABLED_PROJECTS,
  SWEATER_1,
  SWEATER_3,
  SWEATER_8,
  SWEATER_10,
  DEFAULT_DARK_DITHER_SETTINGS,
  DEFAULT_LIGHT_DITHER_SETTINGS,
  ICON_SIZE,
  EYE_SIZE,
};
