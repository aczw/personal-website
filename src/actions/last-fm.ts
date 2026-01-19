import { ActionError, defineAction } from "astro:actions";
import { LASTFM_API_KEY } from "astro:env/server";

import {
  LastFmRecentTracksSchema,
  LastFmTopTracksSchema,
} from "@/scripts/schema";
import { LASTFM_API_PREFIX } from "@/scripts/constants";

const lastFm = {
  getRecentTrack: defineAction({
    input: undefined,
    handler: async () => {
      const response = await fetch(
        `${LASTFM_API_PREFIX}?method=user.getrecenttracks&user=ashzw&api_key=${LASTFM_API_KEY}&limit=1&format=json`,
      );

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

      const result = LastFmRecentTracksSchema.safeParse(await response.json());

      if (!result.success) {
        console.error(result.error.format());

        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to parse Last.fm response! Check logs.",
        });
      }

      const {
        recenttracks: { track },
      } = result.data;
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
      const response = await fetch(
        `${LASTFM_API_PREFIX}?method=user.gettoptracks&user=ashzw&api_key=${LASTFM_API_KEY}&period=7day&limit=1&format=json`,
      );

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

      const result = LastFmTopTracksSchema.safeParse(await response.json());

      if (!result.success) {
        console.error(result.error.format());

        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to parse Last.fm response! Check logs.",
        });
      }

      const {
        toptracks: { track },
      } = result.data;
      const firstTrack = track[0];

      if (!firstTrack) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Did not find any top tracks.",
        });
      }

      const { name, url, playcount } = firstTrack;

      return {
        track: {
          songName: name,
          url,
          count: Number(playcount),
        },
      };
    },
  }),
};

export { lastFm };
