import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

import {
  BlurbSchema,
  ImageSchema,
  ProjectCategoriesSchema,
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
        tech: z.string().array(),
        link: z
          .object({
            href: z.string().url(),
            text: z.string(),
          })
          .optional(),
        sourceHref: z
          .string()
          .url()
          .refine((url) => url.startsWith("https://github.com/"), {
            message: "Source code is assumed to be hosted on GitHub",
          })
          .optional(),
        date: z.string(),
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
