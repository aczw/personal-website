import { ActionError, defineAction } from "astro:actions";
import { LASTFM_API_KEY } from "astro:env/server";
import { z } from "astro/zod";

import { checkResponse, checkSafeParse } from "@/actions/common";

const API_PREFIX = "https://ws.audioscrobbler.com/2.0/";
const USER = "zwcharl";

const AttrSchema = z.object({
  user: z.string(),
  totalPages: z.string(),
  page: z.string(),
  perPage: z.string(),
  total: z.string(),
});

const ImageSchema = z.array(
  z.object({
    size: z.enum(["small", "medium", "large", "extralarge", "mega"]),
    "#text": z.string(),
  }),
);

const RecentTracksSchema = z.object({
  recenttracks: z.object({
    track: z.array(
      z.object({
        artist: z.object({
          mbid: z.string(),
          "#text": z.string(),
        }),
        streamable: z.string(),
        image: ImageSchema,
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
    "@attr": AttrSchema,
  }),
});

const TopAlbumsSchema = z.object({
  topalbums: z.object({
    album: z.array(
      z.object({
        artist: z.object({
          url: z.string(),
          name: z.string(),
          mbid: z.string(),
        }),
        image: ImageSchema,
        mbid: z.string(),
        url: z.string(),
        playcount: z.string(),
        "@attr": z.object({ rank: z.string() }),
        name: z.string(),
      }),
    ),
    "@attr": AttrSchema,
  }),
});

const checkLastFmResponse = (response: Response) => {
  checkResponse(response, "Request to Last.fm failed!");
};

const getLargeCoverUrl = (image: z.infer<typeof ImageSchema>) => {
  let coverUrl = null;

  const largeIndex = image.findIndex((cover) => cover.size === "large");
  if (largeIndex !== -1) {
    coverUrl = image[largeIndex]!["#text"];
  }

  return coverUrl;
};

const lastFm = {
  getRecentTracks: defineAction({
    input: z.object({
      count: z.int().min(1),
    }),

    handler: async ({ count }) => {
      const response = await fetch(
        `${API_PREFIX}?method=user.getrecenttracks&user=${USER}&api_key=${LASTFM_API_KEY}&limit=${count}&format=json`,
      );

      checkLastFmResponse(response);
      const result = RecentTracksSchema.safeParse(await response.json());
      checkSafeParse(result);

      const {
        recenttracks: { track },
      } = result.data!;

      if (track.length < count) {
        throw new ActionError({
          code: "NOT_FOUND",
          message: `Did not find at least ${count} recent tracks.`,
        });
      }

      return track.slice(0, count).map((recentTrack) => {
        const attr = recentTrack["@attr"];
        const date = recentTrack["date"];

        return {
          song: {
            name: recentTrack.name,
            url: recentTrack.url,
          },
          artist: recentTrack.artist["#text"],
          coverUrl: getLargeCoverUrl(recentTrack.image),
          isLive: attr ? attr.nowplaying === "true" : false,
          unixTimestamp: date ? Number(date.uts) : null,
        };
      });
    },
  }),

  getTopAlbums: defineAction({
    input: z.object({
      count: z.int().min(1),
    }),

    handler: async ({ count }) => {
      const response = await fetch(
        `${API_PREFIX}?method=user.gettopalbums&user=${USER}&api_key=${LASTFM_API_KEY}&period=7day&limit=${count}&format=json`,
      );

      checkLastFmResponse(response);
      const result = TopAlbumsSchema.safeParse(await response.json());
      checkSafeParse(result);

      const {
        topalbums: { album },
      } = result.data!;

      if (album.length < count) {
        throw new ActionError({
          code: "NOT_FOUND",
          message: `Did not find at least ${count} albums.`,
        });
      }

      return album.slice(0, count).map((topAlbum) => {
        return {
          name: topAlbum.name,
          coverUrl: getLargeCoverUrl(topAlbum.image),
        };
      });
    },
  }),
};

export { lastFm };
