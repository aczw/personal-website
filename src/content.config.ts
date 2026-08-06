import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

import {
  BlurbSchema,
  DateSchema,
  GalleryCommonSchema as common,
  ImageSchema,
  LinkSchema,
  SourceHrefSchema,
  TechSchema,
} from "@/scripts/schema";

const projects = defineCollection({
  loader: glob({
    pattern: "**/*.mdx",
    base: "./src/content/projects",
    retainBody: false,
  }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      subtitle: z
        .string()
        .refine((subtitle) => subtitle.length <= 40, {
          error:
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
      order: z.number(),
      cover: ImageSchema(image),
    }),
});

const posts = defineCollection({
  loader: glob({
    pattern: "**/*.mdx",
    base: "./src/content/posts",
    retainBody: false,
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      blurb: BlurbSchema.optional(),
      posted: z.iso.date(),
      cover: ImageSchema(image).optional(),
    }),
});

const gallery = defineCollection({
  loader: glob({
    pattern: "**/*.mdx",
    base: "./src/content/gallery",
    retainBody: true,
  }),
  schema: z.discriminatedUnion("type", [
    z.object({
      ...common.shape,
      type: z.literal("visual"),
      category: z.enum(["3d", "traditional", "digital", "cover-art"]),
    }),
    z.object({
      ...common.shape,
      type: z.literal("code"),
      languages: z.string().array(), // Make it broad for now
      libraries: z.string().array(),
      sourceHref: SourceHrefSchema.optional(),
    }),
    z.object({
      ...common.shape,
      type: z.literal("game"),
      stores: z.url().array(),
      engine: z.enum(["unity", "unreal", "godot", "custom"]),
      sourceHref: SourceHrefSchema.optional(),
    }),
  ]),
});

const collections = {
  projects,
  posts,
  gallery,
};

export { collections, ImageSchema };
