import { Resvg } from "@resvg/resvg-js";
import type { APIRoute } from "astro";

import satori from "satori";
import { html } from "satori-html";

export const config = {
  runtime: "edge",
};

const GET: APIRoute = async ({ request }) => {
  const requestUrl = new URL(request.url);
  const params = requestUrl.searchParams;

  const title = params.get("title");
  const blurb = params.get("blurb");
  const post = title && blurb ? { title, blurb } : null;

  const markup = html(`<div tw="h-full w-full bg-[#0A0919] flex flex-col justify-between p-20">
    <div tw="flex flex-col text-[#ADA6FF]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        height="100"
        fill="currentColor"
        viewBox="0 0 25 25"
        tw="mb-3"
      >
        <path
          fill-rule="evenodd"
          d="M.626.626a2.139 2.139 0 0 1 3.025 0l1.82 1.821A12.2 12.2 0 0 1 12.536.21a12.2 12.2 0 0 1 7.022 2.21L21.35.625a2.139 2.139 0 0 1 3.025 3.025L22.58 5.443a12.2 12.2 0 0 1 2.21 7.022 12.2 12.2 0 0 1-2.238 7.063l1.82 1.821a2.139 2.139 0 1 1-3.024 3.025l-1.833-1.833a12.2 12.2 0 0 1-6.981 2.18 12.2 12.2 0 0 1-7.023-2.209L3.65 24.374a2.139 2.139 0 1 1-3.025-3.025l1.862-1.861a12.2 12.2 0 0 1-2.21-7.023c0-2.594.806-5 2.181-6.981L.626 3.65a2.139 2.139 0 0 1 0-3.025ZM8.61 19.414a7.943 7.943 0 0 0 3.925 1.03 7.944 7.944 0 0 0 3.88-1.005L12.5 15.524l-3.89 3.89Zm.866-6.914-3.89 3.89a7.943 7.943 0 0 1-1.03-3.925c0-1.408.364-2.731 1.005-3.88L9.476 12.5Zm6.048 0 3.935 3.934a7.944 7.944 0 0 0 1.055-3.969 7.943 7.943 0 0 0-1.03-3.925l-3.96 3.96Zm.935-6.984L12.5 9.476 8.566 5.54a7.943 7.943 0 0 1 3.969-1.055c1.426 0 2.766.374 3.924 1.03Z"
          clip-rule="evenodd"
        />
      </svg>
      <span tw="text-6xl font-bold">Charles Wang</span>
    </div>

    ${
      post
        ? `<div tw="flex flex-col leading-none p-12 bg-[#1D193D] rounded-3xl">
          <span tw="font-bold text-5xl mb-5 text-[#D6D3FF]">${post.title}</span>
          <span tw="text-4xl text-[#EAE9FF]">${post.blurb}</span>
        </div>`
        : `<div tw="text-6xl text-[#D6D3FF]">Graphics programming, games, websites.</div>`
    }
  </div>`);

  const atkinsonRegular = await fetch(
    new URL("../../assets/AtkinsonHyperlegible-Regular.ttf", import.meta.url),
  ).then((res) => res.arrayBuffer());
  const atkinsonBold = await fetch(
    new URL("../../assets/AtkinsonHyperlegible-Bold.ttf", import.meta.url),
  ).then((res) => res.arrayBuffer());

  const svg = await satori(markup, {
    width: 1280,
    height: 720,
    fonts: [
      {
        name: "Atkinson Hyperlegible",
        data: atkinsonRegular,
        style: "normal",
        weight: 400,
      },
      {
        name: "Atkinson Hyperlegible",
        data: atkinsonBold,
        style: "normal",
        weight: 700,
      },
    ],
  });

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: 1280,
    },
  });

  const image = resvg.render();

  return new Response(image.asPng(), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, no-transform, max-age=604800" /* one week */,
    },
  });
};

export { GET };
