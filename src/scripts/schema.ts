import type { ImageFunction } from "astro:content";
import { z } from "astro/zod";

import { VALID_MONTHS } from "@/scripts/constants";

const LongDescriptionSchema = z.string().refine((text) => text.length <= 170);

const ImageSchema = (image: ImageFunction) =>
  z.strictObject({
    data: image(),
    alt: z.string(),
  });

const LinkSchema = z.object({
  href: z.url(),
  text: z.string(),
});

const SourceHrefSchema = z
  .url()
  .refine((url) => url.startsWith("https://github.com/"), {
    error: "Source code is assumed to be hosted on GitHub",
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
  { error: "Simple date string should be of the form: <month> <year>" },
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
      error: "From date can either be <month> <year>, or just <month>",
    },
  ),
  to: z.string().refine((to) => SimpleDateSchema.safeParse(to).success, {
    error: "To date should be of the form <month> <year>",
  }),
});

const TechSchema = z.string().array();

const DateSchema = z.union([SimpleDateSchema, RangedDateSchema]);

export {
  LongDescriptionSchema,
  ImageSchema,
  LinkSchema,
  SourceHrefSchema,
  SimpleDateSchema,
  RangedDateSchema,
  TechSchema,
  DateSchema,
};
