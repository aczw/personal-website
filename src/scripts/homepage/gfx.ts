import vertSrc from "@/shaders/quad.vert.glsl?raw";
import fragSrc from "@/shaders/tile.frag.glsl?raw";

import type { Result, Err } from "@/scripts/types";

/**
 *  Has to match the project video aspect ratio of 16:10.
 */
const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 400;

type GlCtx = WebGL2RenderingContext;

type Gfx = {
  offCanvas: OffscreenCanvas;
  gl: GlCtx;
  program: WebGLProgram;
  vao: WebGLVertexArrayObject;
};

const createAndCompileShader = (
  gl: GlCtx,
  type: GLenum,
  source: string,
): Result<WebGLShader> => {
  const shader = gl.createShader(type);

  if (!shader) return { kind: "err", message: "Failed to create shader" };

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    return {
      kind: "err",
      message: `Error compiling shader: ${gl.getShaderInfoLog(shader)}`,
    };
  }

  return { kind: "ok", data: shader };
};

const initialize = (): Result<Gfx> => {
  const offCanvas = new OffscreenCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  const gl = offCanvas.getContext("webgl2", {
    depth: false,
    stencil: false,
    antialias: false,
  });

  if (!gl) return { kind: "err", message: "Failed to get WebGL2 context" };

  const vertShaderRes = createAndCompileShader(gl, gl.VERTEX_SHADER, vertSrc);
  const fragShaderRes = createAndCompileShader(gl, gl.FRAGMENT_SHADER, fragSrc);

  if (vertShaderRes.kind === "err") return vertShaderRes;
  if (fragShaderRes.kind === "err") return fragShaderRes;

  const vertShader = vertShaderRes.data;
  const fragShader = fragShaderRes.data;

  const program = gl.createProgram();
  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);

  gl.deleteShader(vertShader);
  gl.deleteShader(fragShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const error: Err = {
      kind: "err",
      message: `Error linking shader program: ${gl.getProgramInfoLog(program)}`,
    };
    gl.deleteProgram(program);
    return error;
  }

  gl.useProgram(program);
  gl.activeTexture(gl.TEXTURE0);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  return { kind: "ok", data: { offCanvas, gl, program, vao } };
};

export { type GlCtx, initialize as initializeGfx };
