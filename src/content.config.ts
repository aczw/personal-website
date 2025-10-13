import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

import {
  BlurbSchema,
  DateSchema,
  ImageSchema,
  LinkSchema,
  ProjectCategoriesSchema,
  SourceHrefSchema,
  TechSchema,
} from "@/scripts/schema";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      subtitle: z
        .string()
        .refine((subtitle) => subtitle.length <= 40, {
          message:
            "Subtitle should be extremely short. Use a blurb for longer content.",
        })
        .optional(),
      blurb: BlurbSchema,
      metadata: z.object({
        tech: TechSchema,
        link: LinkSchema.optional(),
        sourceHref: SourceHrefSchema.optional(),
        date: DateSchema,
      }),
      type: ProjectCategoriesSchema,
      order: z.number(),
      cover: ImageSchema(image),
    }),
});

const posts = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/posts" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      blurb: BlurbSchema.optional(),
      tags: ProjectCategoriesSchema.optional(),
      posted: z.date(),
      cover: ImageSchema(image).optional(),
    }),
});

const collections = {
  projects,
  posts,
};

export { collections, ImageSchema };
