#version 300 es
precision highp float;
precision highp int;

uniform ivec2 u_dimensions;
uniform float u_time;

in vec2 frag_uv;

out vec4 out_color;

const float ONE_OVER_UINT_MAX = 1.f / 4294967295.f;
const float CELL_DENSITY = 1.5f;

// https://www.shadertoy.com/view/XlGcRh
uvec2 pcg2d(uvec2 v) {
  v = v * 1664525u + 1013904223u;
  v.x += v.y * 1664525u;
  v.y += v.x * 1664525u;
  v = v ^ (v >> 16u);
  v.x += v.y * 1664525u;
  v.y += v.x * 1664525u;
  v = v ^ (v >> 16u);
  return v;
}

vec2 hash(vec2 v) {
  return vec2(pcg2d(uvec2(ivec2(v)))) * ONE_OVER_UINT_MAX;
}

float worley(vec2 sample_pos) {
  vec2 base_cell = floor(sample_pos);
  vec2 local_pos = fract(sample_pos);

  float min_distance = 1.f;

  for (int y = -1; y <= 1; ++y) {
    for (int x = -1; x <= 1; ++x) {
      vec2 neighbor = vec2(float(x), float(y));
      vec2 neighbor_center = hash(base_cell + neighbor);
      float distance = length(neighbor + neighbor_center - local_pos);
      min_distance = min(min_distance, distance);
    }
  }

  return min_distance;
}

void main() {
  float aspect_ratio = float(u_dimensions.x) / float(u_dimensions.y);
  vec2 sample_pos = frag_uv * vec2(aspect_ratio, 1.f) * CELL_DENSITY + u_time;

  out_color = vec4(vec3(worley(sample_pos)), 1.f);
}
