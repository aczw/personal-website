import type { ImageFunction } from "astro:content";
import { z } from "astro:schema";

import { PROJECT_CATEGORIES, VALID_MONTHS } from "@/scripts/constants";

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

const TechSchema = z.string().array();

const LinkSchema = z.object({
  href: z.string().url(),
  text: z.string(),
});

const SourceHrefSchema = z
  .string()
  .url()
  .refine((url) => url.startsWith("https://github.com/"), {
    message: "Source code is assumed to be hosted on GitHub",
  });

const SimpleDateSchema = z.string().refine(
  (date) => {
    const split = date.split(" ");

    if (split.length !== 2) {
      return false;
    }

    if (!VALID_MONTHS.includes(split[0]!)) {
      return false;
    }

    const year = Number.parseInt(split[1]!);

    // I guess lower bound it to my birthday??
    if (Number.isNaN(year) || year < 2004) {
      return false;
    }

    return true;
  },
  { message: "Simple date string should be of the form: <month> <year>" },
);

const RangedDateSchema = z.object({
  from: z.string().refine(
    (from) => {
      const result = SimpleDateSchema.safeParse(from);

      if (result.success) {
        return true;
      } else {
        return VALID_MONTHS.includes(from);
      }
    },
    {
      message: "From date can either be <month> <year>, or just <month>",
    },
  ),
  to: z.string().refine((to) => SimpleDateSchema.safeParse(to).success, {
    message: "To date should be of the form <month> <year>",
  }),
});

const DateSchema = z.union([SimpleDateSchema, RangedDateSchema]);

export {
  LastFmSchema,
  ProjectCategoriesSchema,
  BlurbSchema,
  ImageSchema,
  TechSchema,
  LinkSchema,
  SourceHrefSchema,
  SimpleDateSchema,
  RangedDateSchema,
  DateSchema,
};
