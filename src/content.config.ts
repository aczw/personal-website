import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

import {
  ShortDescriptionSchema,
  LongDescriptionSchema,
  DateSchema,
  ImageSchema,
  SourceSchema,
  DesignEntrySchema,
} from "@/scripts/schema";

const getNameFromTopPage = (entry: string) => entry.split("/")[0]!;
const getNameFromSubpage = (entry: string) => {
  const parts = entry.split("/");
  const pageName = parts[2]!.split(".")[0]!;
  return `${parts[0]}/${pageName}`;
};

const projects = defineCollection({
  loader: glob({
    pattern: "*/*.mdx",
    base: "./content/projects",
    retainBody: false,
    generateId: ({ entry }) => getNameFromTopPage(entry),
  }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      description: z.strictObject({
        short: ShortDescriptionSchema,
        long: LongDescriptionSchema,
      }),
      meta: z.strictObject({
        tech: z.array(z.string().nonempty()).nonempty(),
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
    generateId: ({ entry }) => getNameFromSubpage(entry),
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
    generateId: ({ entry }) => getNameFromTopPage(entry),
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
    generateId: ({ entry }) => getNameFromTopPage(entry),
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: ShortDescriptionSchema,
      coverImage: ImageSchema(image),
      instructions: z.string(),
      meta: z.strictObject({
        tech: z.array(z.string().nonempty()).nonempty(),
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
      steam: z
        .strictObject({
          id: z.int(),
          trailer: z.strictObject({
            youTubeId: z.string().nonempty(),
            title: z.string().nonempty(),
          }),
        })
        .optional(),
    }),
});

const covers = defineCollection({
  loader: glob({
    pattern: "*/*.mdx",
    base: "./content/covers",
    retainBody: false,
    generateId: ({ entry }) => getNameFromTopPage(entry),
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string().nonempty(),
      artists: z.array(z.string().nonempty()).nonempty(),
      image: ImageSchema(image),
      meta: z.strictObject({
        created: z.date(),
        tools: z.array(z.string().nonempty()).nonempty(),
      }),
    }),
});

const design = defineCollection({
  loader: glob({
    pattern: "*/*.mdx",
    base: "./content/design",
    retainBody: false,
    generateId: ({ entry }) => getNameFromTopPage(entry),
  }),
  schema: ({ image }) => DesignEntrySchema(image),
});

const designPages = defineCollection({
  loader: glob({
    pattern: "*/pages/*/*.mdx",
    base: "./content/design",
    generateId: ({ entry }) => getNameFromSubpage(entry),
  }),
  schema: ({ image }) => DesignEntrySchema(image),
});

const art = defineCollection({
  loader: glob({
    pattern: "*/*.mdx",
    base: "./content/art",
    generateId: ({ entry }) => getNameFromTopPage(entry),
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string().nonempty(),
      cover: z.strictObject({
        image: ImageSchema(image),
        video: z.boolean(),
      }),
      presentation: z.discriminatedUnion("type", [
        z.strictObject({ type: z.literal("cover") }),
        z.strictObject({
          type: z.literal("images"),
          work: z.array(
            z.strictObject({
              title: z.string().nonempty(),
              image: image(),
            }),
          ),
        }),
      ]),
      meta: z.strictObject({
        created: z.date(),
        tools: z.array(z.string().nonempty()).nonempty(),
      }),
    }),
});

const collections = {
  projects,
  projectPages,
  posts,
  games,
  covers,
  design,
  designPages,
  art,
};

export { collections };
