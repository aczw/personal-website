import { ActionError, defineAction } from "astro:actions";
import { LASTFM_API_KEY } from "astro:env/server";

import { LastFmSchema } from "@/scripts/schema";

export const server = {
  getMostRecentTrack: defineAction({
    input: undefined,
    handler: async () => {
      const response = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=ashzw&api_key=${LASTFM_API_KEY}&limit=1&format=json`,
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

      const result = LastFmSchema.safeParse(await response.json());

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

      const { name, artist, url } = firstTrack;

      return {
        songName: name,
        artist: artist["#text"],
        songUrl: url,
        live:
          firstTrack["@attr"] ?
            firstTrack["@attr"].nowplaying === "true"
          : false,
      };
    },
  }),
};
