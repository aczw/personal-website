#version 300 es
precision highp float;

uniform ivec2 u_dimensions;

in vec2 frag_uv;

out vec4 out_color;

void main() {
  out_color = vec4(frag_uv, 0.f, 1.f);
}
