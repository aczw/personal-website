import type { ImageFunction } from "astro:content";
import { z } from "astro/zod";

import { VALID_MONTHS } from "@/scripts/constants";

const ShortDescriptionSchema = z.string().refine((text) => text.length <= 40);
const LongDescriptionSchema = z.string().refine((text) => text.length <= 170);

const ImageSchema = (image: ImageFunction) =>
  z.strictObject({
    file: image(),
    alt: z.string(),
  });

const SimpleDateSchema = z.string().refine(
  (date) => {
    const split = date.split(" ");

    if (split.length !== 2) return false;
    if (!VALID_MONTHS.includes(split[0]!)) return false;

    const year = Number.parseInt(split[1]!);

    if (Number.isNaN(year)) return false;

    return true;
  },
  { error: "Simple date string should be of the form: <month> <year>" },
);

const RangedDateSchema = z.strictObject({
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

const DateSchema = z.union([SimpleDateSchema, RangedDateSchema]);

const SourceSchema = z
  .url()
  .refine((url) => url.startsWith("https://github.com/"), {
    error: "Source code is assumed to be hosted on GitHub",
  });

const DesignEntrySchema = (image: ImageFunction) =>
  z.object({
    title: z.string().nonempty(),
    type: z.string().nonempty(),
    image: ImageSchema(image),
    meta: z.strictObject({
      created: z.date(),
      tools: z.array(z.string().nonempty()).nonempty(),
    }),
  });

export {
  ShortDescriptionSchema,
  LongDescriptionSchema,
  ImageSchema,
  SimpleDateSchema,
  RangedDateSchema,
  DateSchema,
  SourceSchema,
  DesignEntrySchema,
};
