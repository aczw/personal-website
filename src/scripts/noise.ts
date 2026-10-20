const DitherModeValue = {
  NOISE: 0,
  ORDERED: 1,
} as const;

const BayerMatrixValue = {
  TWO_BY_TWO: 0,
  FOUR_BY_FOUR: 1,
  EIGHT_BY_EIGHT: 2,
} as const;

type DitherMode = (typeof DitherModeValue)[keyof typeof DitherModeValue];
type Color = { r: number; g: number; b: number };

const SWEATER_1: Color = { r: 0.88235, g: 0.8745, b: 1.0 };
const SWEATER_2: Color = { r: 0.83921, g: 0.82745, b: 1.0 };
const SWEATER_3: Color = { r: 0.7647, g: 0.74117, b: 1.0 };
const SWEATER_4: Color = { r: 0.67843, g: 0.65098, b: 1.0 };
const SWEATER_7: Color = { r: 0.28235, g: 0.26274, b: 0.5647 };
const SWEATER_9: Color = { r: 0.11372, g: 0.09803, b: 0.23921 };
const SWEATER_10: Color = { r: 0.03921, g: 0.03529, b: 0.09803 };

export {
  DitherModeValue,
  BayerMatrixValue,
  type DitherMode,
  type Color,
  SWEATER_1,
  SWEATER_2,
  SWEATER_3,
  SWEATER_4,
  SWEATER_7,
  SWEATER_9,
  SWEATER_10,
};
