import {
  DEFAULT_DARK_DITHER_SETTINGS,
  DEFAULT_LIGHT_DITHER_SETTINGS,
  SWEATER_1,
  SWEATER_10,
  SWEATER_3,
  SWEATER_8,
} from "@/scripts/constants";
import {
  BayerMatrixSize,
  DitherMode,
  type Dither,
  type DitherSettings,
} from "@/scripts/dither/types";

const DITHER_PRESETS: DitherSettings[] = [
  DEFAULT_DARK_DITHER_SETTINGS,
  DEFAULT_LIGHT_DITHER_SETTINGS,
  {
    general: {
      mode: DitherMode.ORDERED,
      uvPixelSize: 1,
      numQuantizedColors: 32,
      bias: 0.0,
    },
    color: {
      a: SWEATER_10,
      b: SWEATER_1,
    },
    ordered: {
      bayerMatrixSize: BayerMatrixSize.EIGHT_BY_EIGHT,
      ditheredSize: 1,
    },
  },
  {
    general: {
      mode: DitherMode.ORDERED,
      uvPixelSize: 16,
      numQuantizedColors: 3,
      bias: 0.02,
    },
    color: {
      a: SWEATER_10,
      b: SWEATER_8,
    },
    ordered: {
      bayerMatrixSize: BayerMatrixSize.FOUR_BY_FOUR,
      ditheredSize: 2,
    },
  },
  {
    general: {
      mode: DitherMode.ORDERED,
      uvPixelSize: 32,
      numQuantizedColors: 5,
      bias: -0.08,
    },
    color: {
      a: SWEATER_3,
      b: SWEATER_1,
    },
    ordered: {
      bayerMatrixSize: BayerMatrixSize.EIGHT_BY_EIGHT,
      ditheredSize: 4,
    },
  },
];

function applyDitherSettings(
  dither: Dither,
  {
    general: { mode, uvPixelSize, numQuantizedColors, bias },
    color: { a, b },
    ordered: { bayerMatrixSize, ditheredSize },
  }: DitherSettings,
) {
  dither.general.mode = mode;
  dither.general.uvPixelSize = uvPixelSize;
  dither.general.numQuantizedColors = numQuantizedColors;
  dither.general.bias = bias;

  dither.color.a = a;
  dither.color.b = b;

  dither.ordered.bayerMatrixSize = bayerMatrixSize;
  dither.ordered.ditheredSize = ditheredSize;
}

export { DITHER_PRESETS, applyDitherSettings };
