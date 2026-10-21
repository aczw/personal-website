import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

import {
  LongDescriptionSchema,
  DateSchema,
  ImageSchema,
} from "@/scripts/schema";

const projects = defineCollection({
  loader: glob({
    pattern: "*/*.mdx",
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
        tech: z.string().array(),
        link: z
          .object({
            href: z.url(),
            label: z.string(),
          })
          .optional(),
        sourceHref: z
          .url()
          .refine((url) => url.startsWith("https://github.com/"), {
            error: "Source code is assumed to be hosted on GitHub",
          })
          .optional(),
        date: DateSchema,
      }),
      coverImage: ImageSchema(image),
    }),
});

const projectPages = defineCollection({
  loader: glob({
    pattern: "*/pages/*.mdx",
    base: "./content/projects",
    generateId: ({ entry }) => {
      const parts = entry.split("/");
      const pageName = parts[2]!.split(".")[0]!;
      return `${parts[0]}/${pageName}`;
    },
  }),
  schema: () =>
    z.object({
      title: z.string().nonempty(),
      description: z.string().nonempty(),
    }),
});

const posts = defineCollection({
  loader: glob({
    pattern: "**/*.mdx",
    base: "./content/posts",
    retainBody: true,
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: LongDescriptionSchema.optional(),
      posted: z.date(),
      coverImage: ImageSchema(image).optional(),
    }),
});

const collections = {
  projects,
  projectPages,
  posts,
};

export { collections };
