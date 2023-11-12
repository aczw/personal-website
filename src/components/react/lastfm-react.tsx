import { Link } from "@/components/react/link";
import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";

interface LastFmRecent {
  recenttracks: {
    track: {
      artist: {
        mbid: string;
        "#text": string;
      };
      streamable: string;
      image: {
        size: "small" | "medium" | "large" | "extralarge";
        "#text": string;
      }[];
      mbid: string;
      album: {
        mbid: string;
        "#text": string;
      };
      name: string;
      "@attr"?: {
        nowplaying: "true" | "false";
      };
      url: string;
    }[];
    "@attr": {
      user: string;
      totalPages: string;
      page: string;
      perPage: string;
      total: string;
    };
  };
}

const key = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=ashzw&api_key=${
  import.meta.env.PUBLIC_LASTFM_KEY
}&limit=1&format=json`;

const LastFmReact = () => {
  const { data: recent, isLoading } = useSWR<LastFmRecent>(key, fetcher);

  if (isLoading) {
    return (
      <div
        aria-hidden
        className="min-h-[24px] animate-pulse rounded-md bg-sweater-9"
      />
    );
  }

  const firstTrack = recent?.recenttracks.track[0];

  if (!firstTrack) {
    return (
      <p className="animate-fade [--delay:0s]">
        Tracking my music listening habits is pretty neat. You can find my{" "}
        <Link
          href="https://www.last.fm/user/ashzw"
          newTab
        >
          Last.fm profile here
        </Link>
        .
      </p>
    );
  }

  const songInfo = (
    <>
      <span className="text-sweater-2">{firstTrack.name}</span> by{" "}
      <span className="text-sweater-2">{firstTrack.artist["#text"]}</span>
    </>
  );

  const nowPlaying = firstTrack["@attr"]
    ? firstTrack["@attr"].nowplaying === "true"
    : false;

  return (
    <p className="animate-fade [--delay:0s]">
      {nowPlaying ? (
        <>I am listening to {songInfo} at this very moment.</>
      ) : (
        <>The last song I listened to was {songInfo}.</>
      )}{" "}
      <Link
        href="https://www.last.fm/user/ashzw"
        newTab
      >
        Seriously!
      </Link>
    </p>
  );
};

export { LastFmReact };
