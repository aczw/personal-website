import type { Color } from "@/scripts/dither/types";
import type { GlCtx } from "@/scripts/gfx";

type UniformValue = {
  location: WebGLUniformLocation | null;
  light: Color;
  dark: Color;
};

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

export { setColorScheme };
