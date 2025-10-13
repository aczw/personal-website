export const prerender = false;

import type { APIRoute } from "astro";
import { getEntry } from "astro:content";

import { readFileSync } from "node:fs";

import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import { html } from "satori-html";
import getReadingTime from "reading-time";

import { getDateKind, getShortDateFormatting } from "@/scripts/util";

type Content =
  | { kind: "route"; heading: string }
  | { kind: "post"; title: string; date: Date; readTime: string }
  | { kind: "project"; name: string; tags: string; date: string };

const GET: APIRoute = async ({ request }) => {
  const requestUrl = new URL(request.url);
  const params = requestUrl.searchParams;

  const maybeHeading = params.get("heading");
  const maybePost = params.get("post");
  const maybeProject = params.get("project");

  let c: Content | null = null;

  if (maybeHeading) {
    c = { kind: "route", heading: maybeHeading };
  } else if (maybePost) {
    const post = await getEntry("posts", maybePost);

    if (post && post.body) {
      const minutes = getReadingTime(post.body).minutes;

      c = {
        kind: "post",
        title: post.data.title,
        date: post.data.posted,
        readTime: Math.round(minutes).toString(),
      };
    }
  } else if (maybeProject) {
    const project = await getEntry("projects", maybeProject);

    if (project) {
      const date = getDateKind(project.data.metadata.date);

      c = {
        kind: "project",
        name: project.data.name,
        tags: project.data.metadata.tech.join(", "),
        date:
          date.kind === "simple" ?
            date.date
          : `${date.date.from} — ${date.date.to}`,
      };
    }
  }

  if (!c) {
    return new Response(null, {
      status: 500,
      statusText: "Invalid content received",
    });
  }

  function logo(size: number) {
    return `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="${size}"
        height="${size}"
        fill="currentColor"
        viewBox="0 0 25 25"
        tw="mb-3 text-[#9a91fe]"
      >
        <path
          fill-rule="evenodd"
          d="M.626.626a2.139 2.139 0 0 1 3.025 0l1.82 1.821A12.2 12.2 0 0 1 12.536.21a12.2 12.2 0 0 1 7.022 2.21L21.35.625a2.139 2.139 0 0 1 3.025 3.025L22.58 5.443a12.2 12.2 0 0 1 2.21 7.022 12.2 12.2 0 0 1-2.238 7.063l1.82 1.821a2.139 2.139 0 1 1-3.024 3.025l-1.833-1.833a12.2 12.2 0 0 1-6.981 2.18 12.2 12.2 0 0 1-7.023-2.209L3.65 24.374a2.139 2.139 0 1 1-3.025-3.025l1.862-1.861a12.2 12.2 0 0 1-2.21-7.023c0-2.594.806-5 2.181-6.981L.626 3.65a2.139 2.139 0 0 1 0-3.025ZM8.61 19.414a7.943 7.943 0 0 0 3.925 1.03 7.944 7.944 0 0 0 3.88-1.005L12.5 15.524l-3.89 3.89Zm.866-6.914-3.89 3.89a7.943 7.943 0 0 1-1.03-3.925c0-1.408.364-2.731 1.005-3.88L9.476 12.5Zm6.048 0 3.935 3.934a7.944 7.944 0 0 0 1.055-3.969 7.943 7.943 0 0 0-1.03-3.925l-3.96 3.96Zm.935-6.984L12.5 9.476 8.566 5.54a7.943 7.943 0 0 1 3.969-1.055c1.426 0 2.766.374 3.924 1.03Z"
          clip-rule="evenodd"
        />
      </svg>`;
  }

  function markupRoute(c: { kind: "route"; heading: string }) {
    return `
      <div tw="flex flex-col justify-between m-[75px]">
        <div tw="flex flex-col">
          ${logo(90)}
          <p tw="text-[#9a91fe] font-bold text-[100px] leading-0.5">Charles Wang</p>
        </div>

        <p tw="flex flex-wrap text-[#d6d3ff] text-[80px] text-balance leading-1">
          ${c.heading}
        </p>
      </div>`;
  }

  function markupContent(title: string, subtitle: string, extra: string) {
    if (title === "𝑫𝑶𝑶𝑹") {
      // Provided font doesn't have those characters
      title = "DOOR";
    }

    return `
      <div tw="flex flex-col justify-between text-[#d6d3ff] m-[45px]">
        <div tw="flex flex-col">
          <div tw="flex m-[30px] items-center">
            ${logo(70)}
            <p tw="text-[95px] text-[#9a91fe] ml-[30px] pt-[50px] leading-0 font-bold">
              Charles Wang
            </p>
          </div>
        
          <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="6" viewBox="0 0 1200 6" fill="none">
            <line x1="-2.62268e-07" y1="3" x2="1200" y2="2.9999" stroke="#1D193D" stroke-width="6" stroke-dasharray="20 18"/>
          </svg>
        </div>
        
        <div tw="flex flex-col m-[30px]">
          <p tw="font-bold text-balance text-[80px] text-[#c3bdff] leading-0.9">
            ${title}
          </p>
          <p tw="text-[65px] leading-0.5">
            ${subtitle}
          </p>
          <p tw="text-[65px] leading-0.5">${extra}</p>
        </div>
      </div>
      `;
  }

  const markup = html(`
    <div tw="flex bg-[#0a0919] w-full h-full relative">
      <svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720" fill="none" tw="absolute">
        <line x1="2.62268e-07" y1="42" x2="1280" y2="42.0001" stroke="#1D193D" stroke-width="6"/>
        <line x1="40" y1="720" x2="40" y2="-1.31134e-07" stroke="#1D193D" stroke-width="6"/>
        <line x1="1240" y1="720" x2="1240" y2="-1.31134e-07" stroke="#1D193D" stroke-width="6"/>
        <line x1="2.62268e-07" y1="679" x2="1280" y2="679" stroke="#1D193D" stroke-width="6"/>
      </svg>

      ${
        c.kind === "route" ? markupRoute(c)
        : c.kind === "post" ?
          markupContent(
            c.title,
            `Posted ${getShortDateFormatting(c.date)}`,
            `${c.readTime} minute read`,
          )
        : markupContent(c.name, `Built with ${c.tags}`, c.date)
      }
    </div>`) as React.ReactNode;

  const svg = await satori(markup, {
    width: 1280,
    height: 720,
    fonts: [
      {
        name: "Atkinson Hyperlegible Next",
        data: readFileSync(
          `${process.cwd()}/public/_files/fonts/og/AtkHypNext-Regular.ttf`,
        ),
        style: "normal",
        weight: 400,
      },
      {
        name: "Atkinson Hyperlegible Next",
        data: readFileSync(
          `${process.cwd()}/public/_files/fonts/og/AtkHypNext-SemiBold.ttf`,
        ),
        style: "normal",
        // Pretend semibold is bold because it looks better
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
  const pngBuffer = image.asPng().buffer as ArrayBuffer;

  return new Response(pngBuffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, no-transform, max-age=604800" /* One week */,
    },
  });
};

export { GET };
