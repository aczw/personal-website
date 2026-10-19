import type { GlCtx } from "@/scripts/gfx";

const DitherMode = {
  NOISE: 0,
  ORDERED: 1,
} as const;

const BayerMatrixSize = {
  TWO_BY_TWO: 0,
  FOUR_BY_FOUR: 1,
  EIGHT_BY_EIGHT: 2,
} as const;

type UniformValue = {
  location: WebGLUniformLocation | null;
  light: Color;
  dark: Color;
};

type Color = { r: number; g: number; b: number };

const setColorScheme = (
  gl: GlCtx,
  uniforms: {
    a: UniformValue;
    b: UniformValue;
  },
) => {
  const { a, b } = uniforms;

  const toggleColorScheme = (prefersDark: boolean) => {
    if (prefersDark) {
      gl.uniform3f(a.location, a.dark.r, a.dark.g, a.dark.b);
      gl.uniform3f(b.location, b.dark.r, b.dark.g, b.dark.b);
    } else {
      gl.uniform3f(a.location, a.light.r, a.light.g, a.light.b);
      gl.uniform3f(b.location, b.light.r, b.light.g, b.light.b);
    }
  };

  const prefersDarkQuery = window.matchMedia("(prefers-color-scheme: dark)");
  prefersDarkQuery.addEventListener("change", (ev) =>
    toggleColorScheme(ev.matches),
  );
  toggleColorScheme(prefersDarkQuery.matches);
};

export { DitherMode, BayerMatrixSize, setColorScheme, type Color };
