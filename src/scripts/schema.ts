import type { ImageFunction } from "astro:content";
import { z } from "astro:schema";

import { PROJECT_CATEGORIES } from "@/scripts/constants";

const LastFmSchema = z.object({
  recenttracks: z.object({
    track: z.array(
      z.object({
        artist: z.object({
          mbid: z.string(),
          "#text": z.string(),
        }),
        streamable: z.string(),
        image: z.array(
          z.object({
            size: z.enum(["small", "medium", "large", "extralarge"]),
            "#text": z.string(),
          }),
        ),
        mbid: z.string(),
        album: z.object({
          mbid: z.string(),
          "#text": z.string(),
        }),
        name: z.string(),
        "@attr": z
          .object({
            nowplaying: z.enum(["true", "false"]),
          })
          .optional(),
        url: z.string(),
        date: z
          .object({
            uts: z.string(),
            "#text": z.string(),
          })
          .optional(),
      }),
    ),
    "@attr": z.object({
      user: z.string(),
      totalPages: z.string(),
      page: z.string(),
      perPage: z.string(),
      total: z.string(),
    }),
  }),
});

const ProjectCategoriesSchema = z.enum(PROJECT_CATEGORIES);

const BlurbSchema = z.string().refine((blurb) => blurb.length <= 190, {
  message:
    "Blurb should be 190 characters or less (so it looks nice on the home screen).",
});

const ImageSchema = (image: ImageFunction) =>
  z.object({
    img: image(),
    alt: z.string(),
  });

export { LastFmSchema, ProjectCategoriesSchema, BlurbSchema, ImageSchema };
