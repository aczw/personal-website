#version 300 es
precision highp float;

uniform sampler2D u_video_frame;

in vec2 f_uv;

out vec4 out_color;

/// See https://stackoverflow.com/questions/12964279/whats-the-origin-of-this-glsl-rand-one-liner
float random(vec2 x) {
  return fract(sin(dot(x, vec2(12.9898f, 78.233f))) * 42758.5453f);
}

/// https://blog.maximeheckel.com/posts/the-art-of-dithering-and-retro-shading-web/#a-first-pass-at-dithering-in-react-three-fiber
vec3 noise_dither(vec2 uv, float luminance) {
  if (luminance < random(uv)) {
    return vec3(0.0f);
  } else {
    return vec3(1.0f);
  }
}

/// See https://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
float to_luminance(vec3 color) {
  return dot(vec3(0.2126f, 0.7152f, 0.0722f), color);
}

void main() {
  vec2 uv = vec2(f_uv.x, 1.0f - f_uv.y);
  vec4 video_color = texture(u_video_frame, uv);
  float luminance = to_luminance(video_color.rgb);
  vec3 final_color = noise_dither(uv, luminance);

  out_color = vec4(final_color, 1.0f);
}
