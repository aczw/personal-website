#version 300 es
precision highp float;

uniform sampler2D u_video_frame;

in vec2 f_uv;

out vec4 out_color;

/// Divided by 16.
const mat4 BAYER_MATRIX_4 = mat4(0.0f, 8.0f, 2.0f, 10.0f, 12.0f, 4.0f, 14.0f, 6.0f, 3.0f, 11.0f, 1.0f, 9.0f, 15.0f, 7.0f, 13.0f, 5.0f) * 0.0625f;
const float ORDERED_DITHER_BIAS = 0.01f;

/// See https://stackoverflow.com/questions/12964279/whats-the-origin-of-this-glsl-rand-one-liner.
float random(vec2 x) {
  return fract(sin(dot(x, vec2(12.9898f, 78.233f))) * 42758.5453f);
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
  vec2 pixel = gl_FragCoord.xy;
  ivec2 index = ivec2(int(pixel.x) % 4, int(pixel.y) % 4);
  float threshold = BAYER_MATRIX_4[index.y][index.x];

  if (luminance < threshold + ORDERED_DITHER_BIAS) {
    return vec3(0.0f);
  } else {
    return vec3(1.0f);
  }
}

/// See https://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale.
float to_luminance(vec3 color) {
  return dot(vec3(0.2126f, 0.7152f, 0.0722f), color);
}

void main() {
  vec2 uv = vec2(f_uv.x, 1.0f - f_uv.y);
  vec4 video_color = texture(u_video_frame, uv);
  float luminance = to_luminance(video_color.rgb);
  vec3 final_color = ordered_dither(luminance);

  out_color = vec4(final_color, 1.0f);
}
