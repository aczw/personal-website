import type { ImageFunction } from "astro:content";
import { z } from "astro:schema";

import { VALID_MONTHS } from "@/scripts/constants";

const BlurbSchema = z.string().refine((blurb) => blurb.length <= 170, {
  message:
    "Blurb should be 170 characters or less (so it looks nice in previews).",
});

const ImageSchema = (image: ImageFunction) =>
  z.object({
    img: image(),
    alt: z.string(),
  });

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

const TechSchema = z.string().array();

const DateSchema = z.union([SimpleDateSchema, RangedDateSchema]);

const GalleryCommonSchema = z.object({
  blurb: BlurbSchema,
  date: SimpleDateSchema,
  uses: TechSchema,
  numMembers: z.number().int().min(2).optional(),
  cover: z.enum(["image", "video"]),
});

export {
  BlurbSchema,
  ImageSchema,
  LinkSchema,
  SourceHrefSchema,
  SimpleDateSchema,
  RangedDateSchema,
  TechSchema,
  DateSchema,
  GalleryCommonSchema,
};
