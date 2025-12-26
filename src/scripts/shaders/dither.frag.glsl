#version 300 es
precision highp float;

uniform sampler2D u_video_frame;
uniform ivec2 u_dimension;

uniform int u_dither_mode;
uniform int u_uv_pixel_size;
uniform int u_num_quantized_colors;
uniform float u_bias;

uniform vec3 u_color_a;
uniform vec3 u_color_b;

uniform int u_bayer_matrix_size;
uniform int u_ordered_dither_size;

in vec2 f_uv;

out vec4 out_color;

const mat2 BAYER_MATRIX_2 = mat2(0.0f, 2.0f, 3.0f, 1.0f) / 4.0f;
const mat4 BAYER_MATRIX_4 = mat4(0.0f, 8.0f, 2.0f, 10.0f, 12.0f, 4.0f, 14.0f, 6.0f, 3.0f, 11.0f, 1.0f, 9.0f, 15.0f, 7.0f, 13.0f, 5.0f) / 16.0f;
const float BAYER_MATRIX_8[64] = float[64](0.0f / 64.0f, 48.0f / 64.0f, 12.0f / 64.0f, 60.0f / 64.0f, 3.0f / 64.0f, 51.0f / 64.0f, 15.0f / 64.0f, 63.0f / 64.0f, 32.0f / 64.0f, 16.0f / 64.0f, 44.0f / 64.0f, 28.0f / 64.0f, 35.0f / 64.0f, 19.0f / 64.0f, 47.0f / 64.0f, 31.0f / 64.0f, 8.0f / 64.0f, 56.0f / 64.0f, 4.0f / 64.0f, 52.0f / 64.0f, 11.0f / 64.0f, 59.0f / 64.0f, 7.0f / 64.0f, 55.0f / 64.0f, 40.0f / 64.0f, 24.0f / 64.0f, 36.0f / 64.0f, 20.0f / 64.0f, 43.0f / 64.0f, 27.0f / 64.0f, 39.0f / 64.0f, 23.0f / 64.0f, 2.0f / 64.0f, 50.0f / 64.0f, 14.0f / 64.0f, 62.0f / 64.0f, 1.0f / 64.0f, 49.0f / 64.0f, 13.0f / 64.0f, 61.0f / 64.0f, 34.0f / 64.0f, 18.0f / 64.0f, 46.0f / 64.0f, 30.0f / 64.0f, 33.0f / 64.0f, 17.0f / 64.0f, 45.0f / 64.0f, 29.0f / 64.0f, 10.0f / 64.0f, 58.0f / 64.0f, 6.0f / 64.0f, 54.0f / 64.0f, 9.0f / 64.0f, 57.0f / 64.0f, 5.0f / 64.0f, 53.0f / 64.0f, 42.0f / 64.0f, 26.0f / 64.0f, 38.0f / 64.0f, 22.0f / 64.0f, 41.0f / 64.0f, 25.0f / 64.0f, 37.0f / 64.0f, 21.0f / 64.0f);

/// See https://stackoverflow.com/questions/12964279/whats-the-origin-of-this-glsl-rand-one-liner.
float random(vec2 x) {
  return fract(sin(dot(x, vec2(12.9898f, 78.233f))) * 42758.5453f);
}

/// See https://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale.
float to_luminance(vec3 color) {
  return dot(vec3(0.2126f, 0.7152f, 0.0722f), color);
}

/// See https://blog.maximeheckel.com/posts/the-art-of-dithering-and-retro-shading-web/#shades-of-gray-and-colors.
float quantize(float value) {
  float num_colors = float(u_num_quantized_colors);
  return floor(value * (num_colors - 1.0f) + 0.5f) / (num_colors - 1.0f);
}

/// See https://blog.maximeheckel.com/posts/the-art-of-dithering-and-retro-shading-web/#a-first-pass-at-dithering-in-react-three-fiber.
float noise_dither(vec2 uv, float luminance) {
  float final = quantize(luminance + u_bias);

  if (final < random(uv)) {
    return 0.0f;
  } else {
    return final;
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
      threshold = BAYER_MATRIX_8[index.y * 8 + index.x] + u_bias;
      break;
    }
  }

  float final = luminance + threshold;
  final = quantize(final);

  return final;
}

void main() {
  vec2 flipped_uv = vec2(f_uv.x, 1.0f - f_uv.y);
  vec2 normalized_pixel_size = vec2(u_uv_pixel_size) / vec2(u_dimension);
  vec2 uv = normalized_pixel_size * floor(flipped_uv / normalized_pixel_size);

  vec4 video_color = texture(u_video_frame, uv);
  float luminance = to_luminance(video_color.rgb);

  float t = 0.0f;
  switch (u_dither_mode) {
    case 0:
      t = noise_dither(uv, luminance);
      break;

    case 1:
      t = ordered_dither(luminance);
      break;
  }
  t = clamp(t, 0.0f, 1.0f);

  vec3 final_color = mix(u_color_a, u_color_b, t);
  out_color = vec4(final_color, 1.0f);
}
