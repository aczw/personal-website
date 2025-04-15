import { Filters } from "@/scripts/types";
import { glob } from "astro/loaders";
import { defineCollection, z, type ImageFunction } from "astro:content";

const TypeSchema = z.enum(Filters);

const BlurbSchema = z.string().refine((blurb) => blurb.length <= 190, {
  message: "Blurb should be 190 characters or less (so it looks nice on the home screen).",
});

const ImageSchema = (image: ImageFunction) =>
  z.object({
    img: image(),
    alt: z.string(),
  });

const projects = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
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
            message: "I assume source code is hosted on GitHub!",
          })
          .optional(),
        date: z.string(),
      }),
      type: TypeSchema,
      cover: ImageSchema(image),
      order: z.number(),
    }),
});

const posts = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/posts" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      blurb: BlurbSchema.optional(),
      tags: TypeSchema.optional(),
      posted: z.date(),
      cover: ImageSchema(image).optional(),
    }),
});

const collections = {
  projects,
  posts,
};

export { collections, ImageSchema };
