#version 300 es
precision highp float;

uniform sampler2D u_video_frame;
uniform ivec2 u_dimension;
uniform int u_dither_mode;

in vec2 f_uv;

out vec4 out_color;

const mat2 BAYER_MATRIX_2 = mat2(0.0f, 2.0f, 3.0f, 1.0f) * 0.25f;
const mat4 BAYER_MATRIX_4 = mat4(0.0f, 8.0f, 2.0f, 10.0f, 12.0f, 4.0f, 14.0f, 6.0f, 3.0f, 11.0f, 1.0f, 9.0f, 15.0f, 7.0f, 13.0f, 5.0f) * 0.0625f; ///< Divided by 16.
const float BAYER_MATRIX_8[64] = float[64](0.0f / 64.0f, 48.0f / 64.0f, 12.0f / 64.0f, 60.0f / 64.0f, 3.0f / 64.0f, 51.0f / 64.0f, 15.0f / 64.0f, 63.0f / 64.0f, 32.0f / 64.0f, 16.0f / 64.0f, 44.0f / 64.0f, 28.0f / 64.0f, 35.0f / 64.0f, 19.0f / 64.0f, 47.0f / 64.0f, 31.0f / 64.0f, 8.0f / 64.0f, 56.0f / 64.0f, 4.0f / 64.0f, 52.0f / 64.0f, 11.0f / 64.0f, 59.0f / 64.0f, 7.0f / 64.0f, 55.0f / 64.0f, 40.0f / 64.0f, 24.0f / 64.0f, 36.0f / 64.0f, 20.0f / 64.0f, 43.0f / 64.0f, 27.0f / 64.0f, 39.0f / 64.0f, 23.0f / 64.0f, 2.0f / 64.0f, 50.0f / 64.0f, 14.0f / 64.0f, 62.0f / 64.0f, 1.0f / 64.0f, 49.0f / 64.0f, 13.0f / 64.0f, 61.0f / 64.0f, 34.0f / 64.0f, 18.0f / 64.0f, 46.0f / 64.0f, 30.0f / 64.0f, 33.0f / 64.0f, 17.0f / 64.0f, 45.0f / 64.0f, 29.0f / 64.0f, 10.0f / 64.0f, 58.0f / 64.0f, 6.0f / 64.0f, 54.0f / 64.0f, 9.0f / 64.0f, 57.0f / 64.0f, 5.0f / 64.0f, 53.0f / 64.0f, 42.0f / 64.0f, 26.0f / 64.0f, 38.0f / 64.0f, 22.0f / 64.0f, 41.0f / 64.0f, 25.0f / 64.0f, 37.0f / 64.0f, 21.0f / 64.0f);

const float ORDERED_BIAS = 0.0f;
const int ORDERED_PIXEL_SIZE = 4;

const int NUM_QUANTIZED_COLORS = 16;
const int UV_PIXEL_SIZE = 36;

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
  float num_colors = float(NUM_QUANTIZED_COLORS);
  return floor(value * (num_colors - 1.0f) + 0.5f) / (num_colors - 1.0f);
}

/// See https://blog.maximeheckel.com/posts/the-art-of-dithering-and-retro-shading-web/#a-first-pass-at-dithering-in-react-three-fiber.
vec3 noise_dither(vec2 uv, float luminance) {
  if (luminance < random(uv)) {
    return vec3(0.0f);
  } else {
    return vec3(1.0f);
  }
}

vec3 ordered_dither(float luminance) {
  vec2 pixel = vec2(ORDERED_PIXEL_SIZE) * floor(gl_FragCoord.xy / vec2(ORDERED_PIXEL_SIZE));
  ivec2 index = ivec2(int(pixel.x) % 8, int(pixel.y) % 8);
  float threshold = BAYER_MATRIX_8[index.y * 8 + index.x] + ORDERED_BIAS;

  vec3 final = vec3(luminance);
  final += threshold;
  final.r = quantize(final.r);
  final.g = quantize(final.g);
  final.b = quantize(final.b);

  return final;
}

void main() {
  vec2 flipped_uv = vec2(f_uv.x, 1.0f - f_uv.y);
  vec2 normalized_pixel_size = vec2(UV_PIXEL_SIZE) / vec2(u_dimension);
  vec2 uv = normalized_pixel_size * floor(flipped_uv / normalized_pixel_size);

  vec4 video_color = texture(u_video_frame, uv);
  float luminance = to_luminance(video_color.rgb);

  vec3 final_color = vec3(0.0f);
  switch (u_dither_mode) {
    case 0:
      final_color = noise_dither(uv, luminance);
      break;

    case 1:
      final_color = ordered_dither(luminance);
      break;
  }

  out_color = vec4(final_color, 1.0f);
}
