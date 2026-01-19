import type { ImageFunction } from "astro:content";
import { z } from "astro:schema";

import { VALID_MONTHS } from "@/scripts/constants";

const LastFmAttrSchema = z.object({
  user: z.string(),
  totalPages: z.string(),
  page: z.string(),
  perPage: z.string(),
  total: z.string(),
});

const LastFmImageSchema = z.array(
  z.object({
    size: z.enum(["small", "medium", "large", "extralarge", "mega"]),
    "#text": z.string(),
  }),
);

const LastFmArtistSchema = z.object({
  url: z.string(),
  name: z.string(),
  mbid: z.string(),
});

const LastFmRecentTracksSchema = z.object({
  recenttracks: z.object({
    track: z.array(
      z.object({
        artist: z.object({
          mbid: z.string(),
          "#text": z.string(),
        }),
        streamable: z.string(),
        image: LastFmImageSchema,
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
    "@attr": LastFmAttrSchema,
  }),
});

const LastFmTopTracksSchema = z.object({
  toptracks: z.object({
    track: z.array(
      z.object({
        streamable: z.object({
          fulltrack: z.string(),
          "#text": z.string(),
        }),
        mbid: z.string(),
        name: z.string(),
        image: LastFmImageSchema,
        artist: LastFmArtistSchema,
        url: z.string(),
        duration: z.string(),
        "@attr": z.object({ rank: z.string() }),
        playcount: z.string(),
      }),
    ),
    "@attr": LastFmAttrSchema,
  }),
});

const LastFmTopAlbumsSchema = z.object({
  topalbums: z.object({
    album: z.array(
      z.object({
        artist: LastFmArtistSchema,
        image: LastFmImageSchema,
        mbid: z.string(),
        url: z.string(),
        playcount: z.string(),
        "@attr": z.object({ rank: z.string() }),
        name: z.string(),
      }),
    ),
    "@attr": LastFmAttrSchema,
  }),
});

const LastFmTopArtistsSchema = z.object({
  topartists: z.object({
    artist: z.array(
      z.object({
        streamable: z.string(),
        image: LastFmImageSchema,
        mbid: z.string(),
        url: z.string(),
        playcount: z.string(),
        "@attr": z.object({ rank: z.string() }),
        name: z.string(),
      }),
    ),
    "@attr": LastFmAttrSchema,
  }),
});

const BlurbSchema = z.string().refine((blurb) => blurb.length <= 170, {
  message:
    "Blurb should be 170 characters or less (so it looks nice in previews).",
});

const ImageSchema = (image: ImageFunction) =>
  z.object({
    img: image(),
    alt: z.string(),
  });

const LinkSchema = z.object({
  href: z.string().url(),
  text: z.string(),
});

const SourceHrefSchema = z
  .string()
  .url()
  .refine((url) => url.startsWith("https://github.com/"), {
    message: "Source code is assumed to be hosted on GitHub",
  });

const SimpleDateSchema = z.string().refine(
  (date) => {
    const split = date.split(" ");

    if (split.length !== 2) {
      return false;
    }

    if (!VALID_MONTHS.includes(split[0]!)) {
      return false;
    }

    const year = Number.parseInt(split[1]!);

    // I guess lower bound it to my birthday??
    if (Number.isNaN(year) || year < 2004) {
      return false;
    }

    return true;
  },
  { message: "Simple date string should be of the form: <month> <year>" },
);

const RangedDateSchema = z.object({
  from: z.string().refine(
    (from) => {
      const result = SimpleDateSchema.safeParse(from);

      if (result.success) {
        return true;
      } else {
        return VALID_MONTHS.includes(from);
      }
    },
    {
      message: "From date can either be <month> <year>, or just <month>",
    },
  ),
  to: z.string().refine((to) => SimpleDateSchema.safeParse(to).success, {
    message: "To date should be of the form <month> <year>",
  }),
});

const TechSchema = z.string().array();

const DateSchema = z.union([SimpleDateSchema, RangedDateSchema]);

export {
  LastFmRecentTracksSchema,
  LastFmTopTracksSchema,
  LastFmTopAlbumsSchema,
  LastFmTopArtistsSchema,
  BlurbSchema,
  ImageSchema,
  LinkSchema,
  SourceHrefSchema,
  SimpleDateSchema,
  RangedDateSchema,
  TechSchema,
  DateSchema,
};
