#version 300 es

in vec4 v_position;
in vec2 v_uv;

out vec2 f_uv;

void main() {
  f_uv = v_uv;
  gl_Position = v_position;
}
