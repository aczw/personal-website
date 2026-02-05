export const prerender = false;

import type { APIRoute } from "astro";
import { getEntry } from "astro:content";

import { readFileSync } from "node:fs";

import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import { html } from "satori-html";

import { getDateKind, getShortDateFormatting } from "@/scripts/util";

type RouteKind = { kind: "route"; heading: string };

type OgContent =
  | RouteKind
  | { kind: "post"; title: string; date: Date }
  | { kind: "project"; name: string; tags: string; date: string };

const GET: APIRoute = async ({ request }) => {
  const requestUrl = new URL(request.url);
  const params = requestUrl.searchParams;

  let statusText = "Invalid content received";

  const content: string | null = (() => {
    const maybeHeading = params.get("heading");
    const maybePost = params.get("post");
    const maybeProject = params.get("project");

    return null;
  })();

  if (maybeHeading !== null) {
    c = { kind: "route", heading: maybeHeading };
  } else if (maybePost !== null) {
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
  } else if (maybeProject !== null) {
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

  if (!c) {
    return new Response(null, {
      status: 500,
      statusText,
    });
  }

  function createContent(title: string | null, subtitles: string[]): string {
    return "";
  }

  const markup = html(`
    <div tw="flex w-full h-full" style="background-color: #0a0919;">
      ${content}
    </div>`) as React.ReactNode;

  const name = "Atkinson Hyperlegible Next";
  const fontPathPrefix = `${process.cwd()}/public/_files/fonts/og`;

  const svg = await satori(markup, {
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
