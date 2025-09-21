import type { CollectionEntry } from "astro:content";

import { z } from "astro:schema";

type EntryKind =
  | { kind: "post"; post: CollectionEntry<"posts"> }
  | { kind: "project"; project: CollectionEntry<"projects"> };

type MetaKind =
  | {
      kind: "route";
      title: string | null;
      description: string;
      ogImageParams: string;
    }
  | EntryKind;

const Filters = ["graphics", "games", "art"] as const;

const LastFmSchema = z.object({
  recenttracks: z.object({
    track: z.array(
      z.object({
        artist: z.object({
          mbid: z.string(),
          "#text": z.string(),
        }),
        streamable: z.string(),
        image: z.array(
          z.object({
            size: z.enum(["small", "medium", "large", "extralarge"]),
            "#text": z.string(),
          }),
        ),
        mbid: z.string(),
        album: z.object({
          mbid: z.string(),
          "#text": z.string(),
        }),
        name: z.string(),
        "@attr": z
          .object({
            nowplaying: z.enum(["true", "false"]),
          })
          .optional(),
        url: z.string(),
        date: z
          .object({
            uts: z.string(),
            "#text": z.string(),
          })
          .optional(),
      }),
    ),
    "@attr": z.object({
      user: z.string(),
      totalPages: z.string(),
      page: z.string(),
      perPage: z.string(),
      total: z.string(),
    }),
  }),
});

export { Filters, LastFmSchema, type EntryKind, type MetaKind };
