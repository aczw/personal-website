import { defineCollection, z, type CollectionEntry } from "astro:content";

const changelog = defineCollection({
  type: "content",
  schema: () =>
    z.object({
      version: z.string().regex(/^v[0-9]+\.[0-9]+\.[0-9]+$/g, {
        message: "Version numbers should follow semantic versioning!",
      }),
      date: z.date(),
      commit: z.string().length(40).optional(),
    }),
});

const posts = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      blurb: z.string().refine((blurb) => blurb.length <= 190, {
        message: "Blurb should be 190 characters or less, so it fits on the home screen.",
      }),
      posted: z.date(),
      updated: z.date().optional(),
      cover: z
        .object({
          img: image().refine(
            (img) => {
              const ratio = img.width / img.height;
              const epsilon = 0.01;

              // sometimes we can't get an exact aspect ratio, and that's okay within epsilon
              if (ratio >= 1.6 - epsilon && ratio <= 1.6 + epsilon) {
                return true;
              }

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

type Post = CollectionEntry<"posts">;

const collections = {
  posts,
  changelog,
};

export { collections, type Post };
