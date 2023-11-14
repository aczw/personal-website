import { defineCollection, z } from "astro:content";

const projectsCollection = defineCollection({
  type: "content",
  schema: ({ image }) => z.object({
    title: z.string(),
    link: z.object({
      url: z.string().url(),
      text: z.string()
    }).optional(),
    blurb: z.string(),
    date: z.date(),
    cover: z
      .object({
        img: image(),
        alt: z.string(),
      }),
    tags: z.array(z.string()),
    order: z.number().min(0),
    draft: z.boolean()
  }),
});

export const collections = {
  projects: projectsCollection,
};
