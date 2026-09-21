import { CDN_URL } from "@/scripts/constants";
import type { GlCtx } from "@/scripts/homepage/gfx";
import type { Result } from "@/scripts/types";

type State =
  | { kind: "init"; delay: number }
  | { kind: "procedural" }
  | { kind: "video-loaded"; loadStartTime: number }
  | { kind: "video" };

type Direction = { x: number; y: number };

type Tile = {
  state: State;
  canvasElt: HTMLCanvasElement;
  bitmapCtx: ImageBitmapRenderingContext;
  proc: {
    direction: Direction;
    uvOffset: { u: number; v: number };
  };
  video: {
    elt: HTMLVideoElement;
    frameTex: WebGLTexture;
    isLoaded: boolean;
  };
};

type FrameUniforms = {
  bias: number;
  mix: number;
  orderedDitherSize: number;
};

/**
 * Each of the three tiles pick a different direction to move for its
 * respective procedural noise.
 */
const DIRECTIONS = [
  { x: 1, y: 1 },
  { x: -1, y: 1 },
  { x: 1, y: -1 },
] as const satisfies readonly [Direction, Direction, Direction];

const PROC_INIT_ANIM_DURATION = 1.75;
const BIAS_START = -1;
const BIAS_END = 0;

const VIDEO_INIT_ANIM_DURATION = 0.25;
const MIX_START = 0;
const MIX_END = 1;
const ORDERED_DITHER_SIZE_START = 5;
const ORDERED_DITHER_SIZE_END = 2;

const createTile = (
  gl: GlCtx,
  projectId: string,
  index: number,
): Result<Tile> => {
  const tileEltId = `tile-${index}`;
  const tileCanvasElt = document.getElementById(tileEltId) as HTMLCanvasElement;
  const bitmapCtx = tileCanvasElt.getContext("bitmaprenderer");

  if (!bitmapCtx) {
    return {
      kind: "err",
      message: `Failed to creating bitmap rendering context for tile ${index}`,
    };
  }

  const videoElt = document.createElement("video");
  videoElt.crossOrigin = "anonymous";
  videoElt.src = `${CDN_URL}/projects/${projectId}/cover.mp4`;
  videoElt.muted = true;
  // Prevents video from autoplaying in fullscreen on page load on iOS
  videoElt.playsInline = true;
  videoElt.loop = true;
  videoElt.play().catch(() => {});

  const videoFrameTex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, videoFrameTex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  const tile: Tile = {
    state: { kind: "init", delay: index * 0.15 },
    canvasElt: tileCanvasElt,
    bitmapCtx,
    proc: {
      direction: DIRECTIONS[index]!,
      uvOffset: {
        u: 0.5 + Math.random() * 1.5,
        v: 0.5 + Math.random() * 1.5,
      },
    },
    video: {
      elt: videoElt,
      frameTex: videoFrameTex,
      isLoaded: false,
    },
  };

  const checkIfVideoIsLoaded = () => {
    if (
      videoElt.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA &&
      !tile.video.isLoaded
    ) {
      tile.video.isLoaded = true;
    }
  };
  videoElt.addEventListener("progress", checkIfVideoIsLoaded);
  videoElt.addEventListener("canplaythrough", checkIfVideoIsLoaded);

  // Automatically resume playing videos if they were paused somehow
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") return;
    if (videoElt.paused) videoElt.play().catch(() => {});
  });

  return { kind: "ok", data: tile };
};

const checkToAdvanceState = (gl: GlCtx, tile: Tile, elapsed: number) => {
  switch (tile.state.kind) {
    case "init":
      if (elapsed - tile.state.delay > PROC_INIT_ANIM_DURATION) {
        tile.state = { kind: "procedural" };

        const uploadVideoFrame: VideoFrameRequestCallback = () => {
          gl.bindTexture(gl.TEXTURE_2D, tile.video.frameTex);
          gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            tile.video.elt,
          );

          tile.video.elt.requestVideoFrameCallback(uploadVideoFrame);
        };

        // Start uploading video frames
        tile.video.elt.requestVideoFrameCallback(uploadVideoFrame);
      }
      break;

    case "procedural":
      if (tile.video.isLoaded) {
        tile.state = { kind: "video-loaded", loadStartTime: elapsed };
      }
      break;

    case "video-loaded":
      if (elapsed - tile.state.loadStartTime > VIDEO_INIT_ANIM_DURATION) {
        tile.state = { kind: "video" };
      }
      break;

    case "video":
      break;
  }
};

const lerp = (a: number, b: number, t: number): number => {
  return a * (1 - t) + b * t;
};

const getUniformsForState = (state: State, elapsed: number): FrameUniforms => {
  switch (state.kind) {
    case "init": {
      const uniforms: FrameUniforms = {
        bias: BIAS_START,
        mix: MIX_START,
        orderedDitherSize: ORDERED_DITHER_SIZE_START,
      };
      const offsetElapsed = elapsed - state.delay;

      // Tile is delayed from starting animation
      if (offsetElapsed < 0) return uniforms;

      const t = offsetElapsed / PROC_INIT_ANIM_DURATION;
      uniforms.bias = lerp(BIAS_START, BIAS_END, 1 - Math.pow(1 - t, 5));

      return uniforms;
    }

    case "procedural":
      return {
        bias: BIAS_END,
        mix: MIX_START,
        orderedDitherSize: ORDERED_DITHER_SIZE_START,
      };

    case "video-loaded": {
      const offsetElapsed = elapsed - state.loadStartTime;
      const t = offsetElapsed / VIDEO_INIT_ANIM_DURATION;

      return {
        bias: BIAS_END,
        mix: t,
        orderedDitherSize: lerp(
          ORDERED_DITHER_SIZE_START,
          ORDERED_DITHER_SIZE_END,
          t,
        ),
      };
    }

    case "video":
      return {
        bias: BIAS_END,
        mix: MIX_END,
        orderedDitherSize: ORDERED_DITHER_SIZE_END,
      };
  }
};

export {
  type Direction,
  type Tile,
  createTile,
  checkToAdvanceState,
  getUniformsForState,
};
