#version 300 es
precision highp float;

uniform sampler2D u_video_frame;

// uniform int u_dither_mode;
// uniform int u_uv_pixel_size;
// uniform int u_num_quantized_colors;
// uniform float u_bias;

// uniform vec3 u_color_a;
// uniform vec3 u_color_b;

// uniform int u_bayer_matrix_size;
// uniform int u_ordered_dither_size;

in vec2 f_uv;

out vec4 out_color;

/// See https://stackoverflow.com/questions/12964279/whats-the-origin-of-this-glsl-rand-one-liner.
float random(vec2 x) {
  return fract(sin(dot(x, vec2(12.9898f, 78.233f))) * 42758.5453f);
}

/// See https://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale.
float to_luminance(vec3 color) {
  return dot(vec3(0.2126f, 0.7152f, 0.0722f), color);
}

void main() {
  vec2 flipped_uv = vec2(f_uv.x, 1.0f - f_uv.y);

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
