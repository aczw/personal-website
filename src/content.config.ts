import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

import {
  LongDescriptionSchema,
  DateSchema,
  ImageSchema,
  LinkSchema,
  SourceHrefSchema,
  TechSchema,
} from "@/scripts/schema";

const projects = defineCollection({
  loader: glob({
    pattern: "**/*.mdx",
    base: "./content/projects",
    retainBody: false,
  }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      description: z.strictObject({
        short: z.string().refine((text) => text.length <= 40),
        long: LongDescriptionSchema,
      }),
      metadata: z.strictObject({
        tech: TechSchema,
        link: LinkSchema.optional(),
        sourceHref: SourceHrefSchema.optional(),
        date: DateSchema,
      }),
      coverImage: ImageSchema(image),
    }),
});

const posts = defineCollection({
  loader: glob({
    pattern: "**/*.mdx",
    base: "./content/posts",
    retainBody: false,
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      blurb: LongDescriptionSchema.optional(),
      posted: z.date(),
      cover: ImageSchema(image).optional(),
    }),
});

const collections = {
  projects,
  posts,
};

export { collections, ImageSchema };
