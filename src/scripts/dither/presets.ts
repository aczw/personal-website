import {
  DEFAULT_DARK_DITHER_SETTINGS,
  SWEATER_10,
  SWEATER_8,
} from "@/scripts/constants";
import {
  BayerMatrixSize,
  DitherMode,
  type DitherSettings,
} from "@/scripts/dither/types";

const DITHER_PRESETS: DitherSettings[] = [
  DEFAULT_DARK_DITHER_SETTINGS,
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
];

export { DITHER_PRESETS };
