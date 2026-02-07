export const prerender = false;

import type { APIRoute } from "astro";
import { getEntry } from "astro:content";

import { readFileSync } from "node:fs";

import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import { html } from "satori-html";

import { getDateKind, getShortDateFormatting } from "@/scripts/util";
import type { Route } from "@/scripts/types";

type OgContent = {
  title: string | null;
  subtitles: string[];
};

const ROUTE_DESCRIPTIONS: Record<Route, string> = {
  home: "Pixel pusher, bridge carver",

  projects: "Write-ups and technical breakdowns",
  posts: "Writing whatever",
  gallery: "Everything I've done",

  about: "Who I am",
  "404": "Page not found",
};

const GET: APIRoute = async ({ request }) => {
  const params = new URL(request.url).searchParams;
  const route = params.get("route");
  const project = params.get("projects");
  const post = params.get("posts");

  if (route === null && project === null && post === null) {
    const statusText = "No input parameter";
    return new Response(statusText, {
      status: 400,
      statusText,
    });
  }

  let content: OgContent | null = null;
  let statusText = "Invalid content received";

  if (route !== null) {
    switch (route as Route) {
      case "home":
        content = { title: null, subtitles: [ROUTE_DESCRIPTIONS["home"]] };
        break;

      case "projects":
        content = {
          title: "Portfolio",
          subtitles: [ROUTE_DESCRIPTIONS["projects"]],
        };
        break;

      case "posts":
        content = {
          title: "Writing",
          subtitles: [ROUTE_DESCRIPTIONS["posts"]],
        };
        break;

      case "gallery":
        content = {
          title: "Gallery",
          subtitles: [ROUTE_DESCRIPTIONS["gallery"]],
        };
        break;

      case "about":
        content = { title: "About", subtitles: [ROUTE_DESCRIPTIONS["about"]] };
        break;

      case "404":
        content = { title: "404", subtitles: [ROUTE_DESCRIPTIONS["404"]] };
        break;

      default:
        statusText = "Incorrect route type";
    }
  } else if (project !== null) {
    const post = await getEntry("posts", maybePost);

    if (post) {
      c = {
        kind: "post",
        title: post.data.title,
        date: post.data.posted,
      };
    } else {
      statusText = `Post "${maybePost}" not found`;
    }
  } else if (post !== null) {
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
    } else {
      statusText = `Project ${maybeProject} not found`;
    }
  }

  if (content === null) {
    return new Response(statusText, {
      status: 500,
      statusText,
    });
  }

  const { title, subtitles } = content;

  const markup = html(`<div
    tw="flex h-full w-full flex-col"
    style="background-color: #0a0919; padding: 0px 70px;"
  >
    <div
      tw="flex h-1/2"
      style="border-left: 8px dashed #312d65; padding-left: 65px; padding-top: 65px;"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 25.5 25.5"
        fill="#9a91fe"
        style="height: 90px; width: 90px;"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M.626.626a2.139 2.139 0 0 1 3.025 0l1.82 1.821A12.2 12.2 0 0 1 12.536.21a12.2 12.2 0 0 1 7.022 2.21L21.35.625a2.139 2.139 0 0 1 3.025 3.025L22.58 5.443a12.2 12.2 0 0 1 2.21 7.022 12.2 12.2 0 0 1-2.238 7.063l1.82 1.821a2.139 2.139 0 1 1-3.024 3.025l-1.833-1.833a12.2 12.2 0 0 1-6.981 2.18 12.2 12.2 0 0 1-7.023-2.209L3.65 24.374a2.139 2.139 0 1 1-3.025-3.025l1.862-1.861a12.2 12.2 0 0 1-2.21-7.023c0-2.594.806-5 2.181-6.981L.626 3.65a2.139 2.139 0 0 1 0-3.025ZM8.61 19.414a7.943 7.943 0 0 0 3.925 1.03 7.944 7.944 0 0 0 3.88-1.005L12.5 15.524l-3.89 3.89Zm.866-6.914-3.89 3.89a7.943 7.943 0 0 1-1.03-3.925c0-1.408.364-2.731 1.005-3.88L9.476 12.5Zm6.048 0 3.935 3.934a7.944 7.944 0 0 0 1.055-3.969 7.943 7.943 0 0 0-1.03-3.925l-3.96 3.96Zm.935-6.984L12.5 9.476 8.566 5.54a7.943 7.943 0 0 1 3.969-1.055c1.426 0 2.766.374 3.924 1.03Z"
        />
      </svg>
    </div>

    <div
      tw="flex grow flex-col"
      style="border-left: 8px dashed #312d65; padding-left: 65px; padding-bottom: 65px;"
    >
      ${
        title !== null ?
          `<p tw="text-7xl text-balance font-bold leading-[0.6]" style="color: #9a91fe;">${title}</p>`
        : ""
      }
      ${subtitles
        .map(
          (subtitle) =>
            `<p tw="text-6xl leading-[0.6]" style="color: #c3bdff">${subtitle}</p>`,
        )
        .join("\n")}
    </div>
  </div>`);

  const name = "Atkinson Hyperlegible Next";
  const fontPathPrefix = `${process.cwd()}/public/_files/fonts/og`;

  const svg = await satori(markup as React.ReactNode, {
    width: 1280,
    height: 720,
    fonts: [
      {
        name,
        data: readFileSync(`${fontPathPrefix}/AtkHypNext-Regular.ttf`),
        style: "normal",
        weight: 400,
      },
      {
        name,
        data: readFileSync(`${fontPathPrefix}/AtkHypNext-SemiBold.ttf`),
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
