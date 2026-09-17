#version 300 es
precision highp float;
precision highp int;

uniform sampler2D u_video_frame;

uniform ivec2 u_dimensions;
uniform float u_time;

uniform int u_dither_mode;
uniform int u_uv_pixel_size;
uniform int u_num_quantized_colors;
uniform float u_bias;
uniform float u_speed;
uniform vec2 u_direction;
uniform vec2 u_uv_offset;

uniform float u_mix;

uniform int u_bayer_matrix_size;
uniform int u_ordered_dither_size;

uniform vec3 u_color_a;
uniform vec3 u_color_b;

in vec2 frag_uv;

out vec4 out_color;

const float ONE_OVER_UINT_MAX = 1.f / 4294967295.f;
const float CELL_DENSITY = 0.75f;

const mat2 BAYER_MATRIX_2 = mat2(0.0f, 2.0f, 3.0f, 1.0f) / 4.0f;
const mat4 BAYER_MATRIX_4 = mat4(0.0f, 8.0f, 2.0f, 10.0f, 12.0f, 4.0f, 14.0f, 6.0f, 3.0f, 11.0f, 1.0f, 9.0f, 15.0f, 7.0f, 13.0f, 5.0f) / 16.0f;
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

float random2To1(vec2 v) {
  uvec2 hash = pcg2d(uvec2(ivec2(v)));
  return float(hash.x ^ hash.y) * ONE_OVER_UINT_MAX;
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

/// https://blog.maximeheckel.com/posts/the-art-of-dithering-and-retro-shading-web/#shades-of-gray-and-colors
float quantize(float value) {
  float num_colors = float(u_num_quantized_colors);
  return floor(value * (num_colors - 1.0f) + 0.5f) / (num_colors - 1.0f);
}

// https://blog.maximeheckel.com/posts/the-art-of-dithering-and-retro-shading-web/#a-first-pass-at-dithering-in-react-three-fiber
float noise_dither(float luminance) {
  float final = quantize(luminance + u_bias);

  if (final < random2To1(gl_FragCoord.xy)) {
    return 0.0f;
  } else {
    return clamp(final, 0.f, 1.f);
  }
}

float ordered_dither(float luminance) {
  vec2 offset = vec2(u_ordered_dither_size);
  ivec2 pixel = ivec2(offset * floor(gl_FragCoord.xy / offset));

  float threshold = 0.0f;
  switch (u_bayer_matrix_size) {
    case 0: {
      ivec2 index = pixel & 1;
      threshold = BAYER_MATRIX_2[index.y][index.x];
      break;
    }

    case 1: {
      ivec2 index = pixel & 3;
      threshold = BAYER_MATRIX_4[index.y][index.x];
      break;
    }

    case 2: {
      ivec2 index = pixel & 7;
      threshold = BAYER_MATRIX_8[index.y * 8 + index.x];
      break;
    }
  }

  float final = luminance + threshold;
  final = quantize(final + u_bias);

  return clamp(final, 0.f, 1.f);
}

vec2 pixelate(vec2 uv) {
  vec2 normalized_pixel_size = vec2(u_uv_pixel_size) / vec2(u_dimensions);
  return normalized_pixel_size * floor((uv) / normalized_pixel_size);
}

void main() {
  // Generate Worley noise value
  float aspect_ratio = float(u_dimensions.x) / float(u_dimensions.y);
  vec2 worley_sample_pos = pixelate(frag_uv + u_uv_offset) * vec2(aspect_ratio, 1.f) * CELL_DENSITY + (u_direction * u_time * u_speed);
  float worley_value = compute_worley(worley_sample_pos);

  vec3 video_color = texture(u_video_frame, frag_uv).rgb;
  vec3 worley_color = mix(u_color_a, u_color_b, ordered_dither(worley_value));

  out_color = vec4(mix(worley_color, video_color, u_mix), 1.f);
}
