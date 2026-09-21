#version 300 es
precision highp float;
precision highp int;

uniform sampler2D u_video_frame;

uniform ivec2 u_dimensions;
uniform float u_time;
uniform vec3 u_color_a;
uniform vec3 u_color_b;

uniform float u_bias;
uniform float u_mix;
uniform int u_dither_size;

uniform vec2 u_direction;
uniform vec2 u_offset;

in vec2 frag_uv;

out vec4 out_color;

const int PIXEL_SIZE = 48;
const int QUANTIZED_COLOR_COUNT = 4;
const float PROC_SPEED_MULT = 0.5f;
const float CELL_DENSITY = 0.75f;

const float ONE_OVER_UINT_MAX = 1.f / 4294967295.f;
const float BAYER_MATRIX_8[64] = float[64](0.0f / 64.0f, 48.0f / 64.0f, 12.0f / 64.0f, 60.0f / 64.0f, 3.0f / 64.0f, 51.0f / 64.0f, 15.0f / 64.0f, 63.0f / 64.0f, 32.0f / 64.0f, 16.0f / 64.0f, 44.0f / 64.0f, 28.0f / 64.0f, 35.0f / 64.0f, 19.0f / 64.0f, 47.0f / 64.0f, 31.0f / 64.0f, 8.0f / 64.0f, 56.0f / 64.0f, 4.0f / 64.0f, 52.0f / 64.0f, 11.0f / 64.0f, 59.0f / 64.0f, 7.0f / 64.0f, 55.0f / 64.0f, 40.0f / 64.0f, 24.0f / 64.0f, 36.0f / 64.0f, 20.0f / 64.0f, 43.0f / 64.0f, 27.0f / 64.0f, 39.0f / 64.0f, 23.0f / 64.0f, 2.0f / 64.0f, 50.0f / 64.0f, 14.0f / 64.0f, 62.0f / 64.0f, 1.0f / 64.0f, 49.0f / 64.0f, 13.0f / 64.0f, 61.0f / 64.0f, 34.0f / 64.0f, 18.0f / 64.0f, 46.0f / 64.0f, 30.0f / 64.0f, 33.0f / 64.0f, 17.0f / 64.0f, 45.0f / 64.0f, 29.0f / 64.0f, 10.0f / 64.0f, 58.0f / 64.0f, 6.0f / 64.0f, 54.0f / 64.0f, 9.0f / 64.0f, 57.0f / 64.0f, 5.0f / 64.0f, 53.0f / 64.0f, 42.0f / 64.0f, 26.0f / 64.0f, 38.0f / 64.0f, 22.0f / 64.0f, 41.0f / 64.0f, 25.0f / 64.0f, 37.0f / 64.0f, 21.0f / 64.0f);

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

vec2 random2To2(vec2 v) {
  return vec2(pcg2d(uvec2(ivec2(v)))) * ONE_OVER_UINT_MAX;
}

float compute_worley(vec2 sample_pos) {
  vec2 base_cell = floor(sample_pos);
  vec2 local_pos = fract(sample_pos);

  float min_distance = 1.f;

  for (int y = -1; y <= 1; ++y) {
    for (int x = -1; x <= 1; ++x) {
      vec2 neighbor = vec2(float(x), float(y));
      vec2 neighbor_center = random2To2(base_cell + neighbor);
      float distance = length(neighbor + neighbor_center - local_pos);
      min_distance = min(min_distance, distance);
    }
  }

  return min_distance;
}

// https://blog.maximeheckel.com/posts/the-art-of-dithering-and-retro-shading-web/#shades-of-gray-and-colors
float quantize(float value) {
  float num_colors = float(QUANTIZED_COLOR_COUNT);
  return floor(value * (num_colors - 1.0f) + 0.5f) / (num_colors - 1.0f);
}

float ordered_dither(float value) {
  ivec2 pixel = ivec2(floor(gl_FragCoord.xy / vec2(u_dither_size)));
  ivec2 index = pixel & 7;
  float threshold = BAYER_MATRIX_8[index.y * 8 + index.x];

  float num_colors = float(QUANTIZED_COLOR_COUNT);
  float final = value + (threshold - 0.5f) / (num_colors - 1.f);
  final = quantize(final + u_bias);

  return clamp(final, 0.f, 1.f);
}

vec2 pixelate(vec2 uv) {
  vec2 normalized_pixel_size = vec2(PIXEL_SIZE) / vec2(u_dimensions);
  return normalized_pixel_size * floor((uv) / normalized_pixel_size);
}

void main() {
  // Generate Worley noise value
  float aspect_ratio = float(u_dimensions.x) / float(u_dimensions.y);
  vec2 worley_sample_pos = pixelate(frag_uv + u_offset) * vec2(aspect_ratio, 1.f) * CELL_DENSITY + (u_direction * u_time * PROC_SPEED_MULT);
  float worley_value = compute_worley(worley_sample_pos);

  vec3 video_color = texture(u_video_frame, frag_uv).rgb;
  float dithered_worley_value = ordered_dither(worley_value);
  vec3 worley_color = mix(u_color_a, u_color_b, dithered_worley_value);

  float r = ordered_dither(video_color.r);
  float g = ordered_dither(video_color.g);
  float b = ordered_dither(video_color.b);
  vec3 test = vec3(r, g, b);

  // Ease in out quart
  float x = dithered_worley_value;
  if (x < 0.5f) {
    dithered_worley_value = 8.f * x * x * x * x;
  } else {
    dithered_worley_value = 1.f - pow(-2.f * x + 2.f, 4.f) * 0.5f;
  }

  dithered_worley_value = clamp((dithered_worley_value * 0.3f) + 0.7f, 0.f, 1.f);
  vec3 mixed_color = mix(worley_color, test * dithered_worley_value, u_mix);

  out_color = vec4(mixed_color, 1.f);
}
