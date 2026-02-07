import { ActionError, defineAction } from "astro:actions";
import { LASTFM_API_KEY } from "astro:env/server";
import { z } from "astro/zod";

import { checkResponse, checkSafeParse } from "@/actions/common";

const LASTFM_API_PREFIX = "https://ws.audioscrobbler.com/2.0/";

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

const ArtistSchema = z.object({
  url: z.string(),
  name: z.string(),
  mbid: z.string(),
});

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

const TopTracksSchema = z.object({
  toptracks: z.object({
    track: z.array(
      z.object({
        streamable: z.object({
          fulltrack: z.string(),
          "#text": z.string(),
        }),
        mbid: z.string(),
        name: z.string(),
        image: ImageSchema,
        artist: ArtistSchema,
        url: z.string(),
        duration: z.string(),
        "@attr": z.object({ rank: z.string() }),
        playcount: z.string(),
      }),
    ),
    "@attr": AttrSchema,
  }),
});

const TopAlbumsSchema = z.object({
  topalbums: z.object({
    album: z.array(
      z.object({
        artist: ArtistSchema,
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

const TopArtistsSchema = z.object({
  topartists: z.object({
    artist: z.array(
      z.object({
        streamable: z.string(),
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

function checkLastFmResponse(response: Response) {
  checkResponse(response, "Request to Last.fm failed!");
}

const lastFm = {
  getRecentTrack: defineAction({
    input: undefined,
    handler: async () => {
      const response = await fetch(
        `${LASTFM_API_PREFIX}?method=user.getrecenttracks&user=ashzw&api_key=${LASTFM_API_KEY}&limit=1&format=json`,
      );

      checkLastFmResponse(response);
      const result = RecentTracksSchema.safeParse(await response.json());
      checkSafeParse(result);

      const {
        recenttracks: { track },
      } = result.data!;
      const firstTrack = track[0];

      if (!firstTrack) {
        throw new ActionError({
          code: "NOT_FOUND",
          message: "Did not find any recent tracks.",
        });
      }

      const { artist, image, album, name, url } = firstTrack;

      let coverUrl = null;
      const mediumIndex = image.findIndex((cover) => cover.size === "large");
      if (mediumIndex !== -1) {
        coverUrl = image[mediumIndex]!["#text"];
      }

      return {
        artist: artist["#text"],
        coverUrl,
        album: album["#text"],
        songName: name,
        songUrl: url,

        live:
          firstTrack["@attr"] ?
            firstTrack["@attr"].nowplaying === "true"
          : false,
      };
    },
  }),

  getTopStats: defineAction({
    input: undefined,
    handler: async () => {
      const topTrackResponse = await fetch(
        `${LASTFM_API_PREFIX}?method=user.gettoptracks&user=ashzw&api_key=${LASTFM_API_KEY}&period=7day&limit=1&format=json`,
      );

      checkLastFmResponse(topTrackResponse);
      const topTrackResult = TopTracksSchema.safeParse(
        await topTrackResponse.json(),
      );
      checkSafeParse(topTrackResult);

      const {
        toptracks: { track },
      } = topTrackResult.data!;
      const firstTrack = track[0];

      if (!firstTrack) {
        throw new ActionError({
          code: "NOT_FOUND",
          message: "Did not find any top tracks.",
        });
      }

      const topAlbumResponse = await fetch(
        `${LASTFM_API_PREFIX}?method=user.gettopalbums&user=ashzw&api_key=${LASTFM_API_KEY}&period=7day&limit=1&format=json`,
      );

      checkLastFmResponse(topAlbumResponse);
      const topAlbumResult = TopAlbumsSchema.safeParse(
        await topAlbumResponse.json(),
      );
      checkSafeParse(topAlbumResult);

      const {
        topalbums: { album },
      } = topAlbumResult.data!;
      const firstAlbum = album[0];

      if (!firstAlbum) {
        throw new ActionError({
          code: "NOT_FOUND",
          message: "Did not find any top albums.",
        });
      }

      const topArtistResponse = await fetch(
        `${LASTFM_API_PREFIX}?method=user.gettopartists&user=ashzw&api_key=${LASTFM_API_KEY}&period=7day&limit=1&format=json`,
      );

      checkLastFmResponse(topArtistResponse);
      const topArtistResult = TopArtistsSchema.safeParse(
        await topArtistResponse.json(),
      );
      checkSafeParse(topAlbumResult);

      const {
        topartists: { artist },
      } = topArtistResult.data!;
      const firstArtist = artist[0];

      if (!firstArtist) {
        throw new ActionError({
          code: "NOT_FOUND",
          message: "Did not find any top artists.",
        });
      }

      return {
        track: {
          name: firstTrack.name,
          url: firstTrack.url,
          count: Number(firstTrack.playcount),
        },

        album: {
          name: firstAlbum.name,
          url: firstAlbum.url,
          count: Number(firstAlbum.playcount),
        },

        artist: {
          name: firstArtist.name,
          url: firstArtist.url,
          count: Number(firstArtist.playcount),
        },
      };
    },
  }),
};

export { lastFm };
