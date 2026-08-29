#version 300 es

out vec2 frag_uv;

// Coordinates for drawing an oversized triangle (acts as fullscreen quad)
const vec2 UV_COORDS[] = vec2[](vec2(0.f, 0.f), vec2(2.f, 0.f), vec2(0.f, 2.f));

void main() {
  vec2 uv = UV_COORDS[gl_VertexID];
  // Derive clip space positions from UV coords. This gives us
  // [0] = (-1f, -1.f), [1] = (3.f, -1.f), [2] = (-1.f, 3.f)
  vec2 position_xy = (2.f * uv) - 1.f;

  frag_uv = uv;
  gl_Position = vec4(position_xy, 0.f, 1.f);
}
