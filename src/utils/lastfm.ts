import { z } from "astro/zod";

const recentTracksSchema = z.promise(
  z.object({
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
  }),
);

const key = import.meta.env.LASTFM_API_KEY;
const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=ashzw&api_key=${key}&limit=1&format=json`;

const getRecentTracks = async () => {
  const data = await recentTracksSchema.parse(
    fetch(url).then((res) => res.json()),
  );

  return data.recenttracks;
};

export { getRecentTracks };
