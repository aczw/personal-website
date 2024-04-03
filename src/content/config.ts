import { defineCollection, z, type CollectionEntry } from "astro:content";

const posts = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      blurb: z.string().refine((blurb) => blurb.length <= 190, {
        message: "Blurb should be 190 characters or less, so it fits on the home screen.",
      }),
      tags: z.array(z.string()),
      cover: z.object({
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
      }),

      project: z
        .object({
          duration: z.object({
            from: z.union([z.date(), z.string()]),
            to: z.union([z.date(), z.string()]),
            length: z.string(),
          }),
          teamSize: z
            .number()
            .refine((size) => size >= 2, {
              message:
                "Team size is currently less than 2. This property is optional, so you can just remove it!",
            })
            .optional(),
          role: z.array(z.string()),
          link: z
            .object({
              url: z.string().url(),
              text: z.string(),
            })
            .optional(),
        })
        .optional(),

      order: z.number().min(1),
      published: z.boolean(),
    }),
});

type Project = NonNullable<CollectionEntry<"posts">["data"]["project"]>;

const collections = {
  posts,
};

export { collections, type Project };
