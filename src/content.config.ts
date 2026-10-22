import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

import {
  ShortDescriptionSchema,
  LongDescriptionSchema,
  DateSchema,
  ImageSchema,
  SourceSchema,
} from "@/scripts/schema";

const getNameFromEntryFile = (entry: string) => entry.split("/")[0]!;

const projects = defineCollection({
  loader: glob({
    pattern: "*/*.mdx",
    base: "./content/projects",
    retainBody: false,
    generateId: ({ entry }) => getNameFromEntryFile(entry),
  }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      description: z.strictObject({
        short: ShortDescriptionSchema,
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
        sourceHref: SourceSchema.optional(),
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
    pattern: "*/*.mdx",
    base: "./content/posts",
    retainBody: true,
    generateId: ({ entry }) => getNameFromEntryFile(entry),
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: LongDescriptionSchema.optional(),
      posted: z.date(),
      coverImage: ImageSchema(image).optional(),
    }),
});

const games = defineCollection({
  loader: glob({
    pattern: "*/*.mdx",
    base: "./content/games",
    retainBody: false,
    generateId: ({ entry }) => getNameFromEntryFile(entry),
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: ShortDescriptionSchema,
      coverImage: ImageSchema(image),
      instructions: z.string(),
      metadata: z.strictObject({
        tech: z.string().array(),
        released: z.date(),
        sourceHref: SourceSchema.optional(),
      }),
      itch: z
        .strictObject({
          url: z.url(),
          webEmbed: z
            .strictObject({
              id: z.int(),
              aspectRatio: z.strictObject({
                x: z.number().nonnegative(),
                y: z.number().nonnegative(),
              }),
            })
            .optional(),
          download: z.strictObject({
            windows: z.boolean(),
            mac: z.boolean(),
            linux: z.boolean(),
          }),
        })
        .optional(),
    }),
});

const collections = {
  projects,
  projectPages,
  posts,
  games,
};

export { collections };
