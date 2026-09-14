const DitherMode = {
  NOISE: 0,
  ORDERED: 1,
} as const;

const BayerMatrixSize = {
  TWO_BY_TWO: 0,
  FOUR_BY_FOUR: 1,
  EIGHT_BY_EIGHT: 2,
} as const;

type Color = { r: number; g: number; b: number };

type DitherInformation = {
  canvasSize: string;
  backend: "WebGL 2" | "WebGPU";
};

type DitherSettings = {
  general: {
    mode: (typeof DitherMode)[keyof typeof DitherMode];
    uvPixelSize: number;
    numQuantizedColors: number;
    bias: number;
  };
  color: {
    a: Color;
    b: Color;
  };
  ordered: {
    bayerMatrixSize: (typeof BayerMatrixSize)[keyof typeof BayerMatrixSize];
    ditheredSize: number;
  };
};

type Dither = DitherInformation & DitherSettings;

type TileState =
  | { kind: "init"; delay: number }
  | { kind: "procedural" }
  | { kind: "video-loaded"; loadStartTime: number };

type Tile = {
  canvas: HTMLCanvasElement;
  bitmapCtx: ImageBitmapRenderingContext;
  videoElt: HTMLVideoElement;
  videoFrameTex: WebGLTexture;
  state: TileState;
};

export {
  DitherMode,
  BayerMatrixSize,
  type Color,
  type DitherInformation,
  type DitherSettings,
  type Dither,
  type Tile,
};
