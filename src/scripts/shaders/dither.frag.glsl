#version 300 es
precision highp float;

uniform sampler2D u_video_frame;

in vec2 f_uv;

out vec4 out_color;

void main() {
  vec4 video_color = texture(u_video_frame, f_uv);
  out_color = vec4(video_color.rgb, 1.0f);
}
