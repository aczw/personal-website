import type { APIRoute } from "astro";
import { z } from "astro/zod";

interface Track {
  song: string;
  artist: string;
  url: string;
  live: boolean;
}

const GET: APIRoute = async () => {
  const LastFmSchema = z.promise(
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

  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=ashzw&api_key=${import.meta.env.LASTFM_API_KEY}&limit=1&format=json`;

  try {
    const response = fetch(url);
    const result = LastFmSchema.safeParse(response.then((res) => res.json()));

    if (!result.success) {
      return new Response(null, { status: 502 });
    }

    const firstTrack = (await result.data).recenttracks.track[0];

    return new Response(
      JSON.stringify({
        song: firstTrack.name,
        artist: firstTrack.artist["#text"],
        url: firstTrack.url,
        live: firstTrack["@attr"] ? firstTrack["@attr"].nowplaying === "true" : false,
      }),
      { status: 200 },
    );
  } catch (e) {
    return new Response(null, { status: 502 });
  }
};

export { GET, type Track };
