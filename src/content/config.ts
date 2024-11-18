import { defineCollection, z, type SchemaContext } from "astro:content";

const Filters = ["graphics", "games", "art"] as const;
const TypeSchema = z.enum(Filters);

const BlurbSchema = z.string().refine((blurb) => blurb.length <= 190, {
  message: "Blurb should be 190 characters or less (so it looks nice on the home screen).",
});

const ImageAspectRatioSchema = ({ image }: SchemaContext) =>
  image().refine(
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
  );

const ProjectCoverSchema = ({ image }: SchemaContext) =>
  z.object({
    img: z.object({
      src: ImageAspectRatioSchema({ image }),
      alt: z.string(),
    }),
  });

const projects = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      blurb: BlurbSchema,
      tags: z.array(z.string()),
      link: z
        .object({
          href: z.string().url(),
          text: z.string(),
          icon: z.enum(["ext", "play"]),
        })
        .optional(),
      type: TypeSchema,
      cover: ProjectCoverSchema({ image }),
      order: z.number(),
    }),
});

const posts = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      blurb: BlurbSchema,
      tags: TypeSchema.optional(),
      posted: z.date(),
      updated: z.date().optional(),
      cover: z
        .object({
          img: ImageAspectRatioSchema({ image }),
          alt: z.string(),
        })
        .optional(),

      published: z.boolean(),
    }),
});

const collections = {
  projects,
  posts,
};

export { collections, Filters, ProjectCoverSchema };
