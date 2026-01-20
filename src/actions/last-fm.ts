import { ActionError, defineAction } from "astro:actions";
import { LASTFM_API_KEY } from "astro:env/server";
import type { SafeParseReturnType } from "astro/zod";

import {
  LastFmRecentTracksSchema,
  LastFmTopAlbumsSchema,
  LastFmTopArtistsSchema,
  LastFmTopTracksSchema,
} from "@/scripts/schema";

const LASTFM_API_PREFIX = "https://ws.audioscrobbler.com/2.0/";

function checkResponse(response: Response) {
  if (!response.ok) {
    let message = "Request to Last.fm servers failed!";

    if (response.statusText.length !== 0) {
      message += ` Server message: ${response.statusText}`;
    }

    throw new ActionError({
      code: "INTERNAL_SERVER_ERROR",
      message,
    });
  }
}

function checkSafeParse<In, Out>(result: SafeParseReturnType<In, Out>) {
  if (!result.success) {
    console.error(result.error.format());

    throw new ActionError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to parse Last.fm response! Check logs.",
    });
  }

  return true;
}

const lastFm = {
  getRecentTrack: defineAction({
    input: undefined,
    handler: async () => {
      const response = await fetch(
        `${LASTFM_API_PREFIX}?method=user.getrecenttracks&user=ashzw&api_key=${LASTFM_API_KEY}&limit=1&format=json`,
      );

      checkResponse(response);
      const result = LastFmRecentTracksSchema.safeParse(await response.json());

      checkSafeParse(result);
      const {
        recenttracks: { track },
      } = result.data!;
      const firstTrack = track[0];

      if (!firstTrack) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
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

      checkResponse(topTrackResponse);
      const topTrackResult = LastFmTopTracksSchema.safeParse(
        await topTrackResponse.json(),
      );

      checkSafeParse(topTrackResult);
      const {
        toptracks: { track },
      } = topTrackResult.data!;
      const firstTrack = track[0];

      if (!firstTrack) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Did not find any top tracks.",
        });
      }

      const topAlbumResponse = await fetch(
        `${LASTFM_API_PREFIX}?method=user.gettopalbums&user=ashzw&api_key=${LASTFM_API_KEY}&period=7day&limit=1&format=json`,
      );

      checkResponse(topAlbumResponse);
      const topAlbumResult = LastFmTopAlbumsSchema.safeParse(
        await topAlbumResponse.json(),
      );

      checkSafeParse(topAlbumResult);
      const {
        topalbums: { album },
      } = topAlbumResult.data!;
      const firstAlbum = album[0];

      if (!firstAlbum) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Did not find any top albums.",
        });
      }

      const topArtistResponse = await fetch(
        `${LASTFM_API_PREFIX}?method=user.gettopartists&user=ashzw&api_key=${LASTFM_API_KEY}&period=7day&limit=1&format=json`,
      );

      checkResponse(topArtistResponse);
      const topArtistResult = LastFmTopArtistsSchema.safeParse(
        await topArtistResponse.json(),
      );

      checkSafeParse(topAlbumResult);
      const {
        topartists: { artist },
      } = topArtistResult.data!;
      const firstArtist = artist[0];

      if (!firstArtist) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
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
