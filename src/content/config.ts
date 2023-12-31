import { defineCollection, z } from "astro:content";

const writeUps = defineCollection({
  type: "content",
  schema: ({ image }) => z.object({
    title: z.string(),
    link: z.object({
      url: z.string().url(),
      text: z.string()
    }).optional(),
    blurb: z.string(),
    duration: z.object({
      date: z.date(),
      length: z.string(),
    }),
    cover: z
      .object({
        img: image(),
        alt: z.string(),
      }),
    tags: z.array(z.string()),
    role: z.array(z.string()),
    teamSize: z.number().min(2).optional(),
    order: z.number().min(1),
    published: z.boolean()
  }),
});

export const collections = {
  "write-ups": writeUps,
};