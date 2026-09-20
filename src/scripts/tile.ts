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

/**
 * Each of the three tiles pick a different direction to move for its
 * respective procedural noise.
 */
const DIRECTIONS = [
  { x: 1, y: 1 },
  { x: -1, y: 1 },
  { x: 1, y: -1 },
] as const satisfies readonly [Direction, Direction, Direction];

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

export { type Direction, type Tile, createTile };
