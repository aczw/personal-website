import { defineCollection, z } from "astro:content";

const posts = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      blurb: z.string().refine((blurb) => blurb.length <= 190, {
        message: "Blurb should be 190 characters or less, so it fits on the home screen.",
      }),
      tags: z.array(z.enum(["graphics", "game", "web"])),
      posted: z.date(),
      updated: z.date().optional(),
      cover: z
        .object({
          img: image().refine(
            (img) => {
              const ratio = img.width / img.height;
              const epsilon = 0.01;

              // sometimes we can't get an exact aspect ratio, and that's okay within epsilon
              if (Math.abs(ratio - 1.6) <= epsilon) return true;

              return false;
            },
            {
              message: "Cover image must have a 16:10 aspect ratio (my laptop display)",
            },
          ),
          alt: z.string(),
        })
        .optional(),

      published: z.boolean(),
    }),
});

const collections = {
  posts,
};

export { collections };
