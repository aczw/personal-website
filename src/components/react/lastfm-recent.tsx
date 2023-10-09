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

const LastFmRecent = () => {
  const { data: recent, isLoading } = useSWR<LastFmRecent>(key, fetcher);

  const header = (
    <h4 className="w-fit font-mono text-sm font-bold text-sweater-2">
      Most recent track
    </h4>
  );

  if (isLoading) {
    return (
      <>
        <div className="flex flex-col">
          {header}
          <p>Loading my most recent song...</p>
        </div>

        <div className="flex items-center space-x-5">
          <div className="h-[80px] w-[80px] shrink-0 animate-pulse rounded bg-sweater-8 xs:h-[85px] xs:w-[85px] 2xl:h-[110px] 2xl:w-[110px]"></div>
          <div className="h-[72px] w-full animate-pulse rounded bg-sweater-8 2xl:h-[96px]"></div>
        </div>
      </>
    );
  }

  const firstTrack = recent?.recenttracks.track[0];

  if (!firstTrack) {
    return (
      <div className="flex flex-col">
        {header}
        <p>
          I can&apos;t seem to load my most recently listened to song. Refresh
          and see if it fixes itself? 🥲🫠
        </p>
      </div>
    );
  }

  const nowPlaying = firstTrack["@attr"]
    ? firstTrack["@attr"].nowplaying === "true"
    : false;

  return (
    <>
      <div className="flex flex-col">
        <h4 className="w-fit font-mono text-sm font-bold text-sweater-2">
          {nowPlaying ? "Currently playing" : "Last listened to"}
        </h4>
        <p>
          {nowPlaying
            ? "I'm listening to this song right now!!"
            : "This is the last song I played."}
        </p>
      </div>

      <div className="flex animate-fade-in items-center space-x-5">
        <img
          src={firstTrack.image[2]["#text"]}
          alt={`Album art for ${firstTrack.name}`}
          className="h-[80px] w-[80px] rounded bg-sweater-8 xs:h-[85px] xs:w-[85px] 2xl:h-[110px] 2xl:w-[110px]"
        />
        <div className="flex flex-col">
          <Link
            href={firstTrack.url}
            title={firstTrack.name}
            newTab
          >
            {firstTrack.name}
          </Link>
          <p className="line-clamp-1">
            by{" "}
            <span className="text-sweater-2">{firstTrack.artist["#text"]}</span>
          </p>
          <p className="line-clamp-1 2xl:line-clamp-2">
            from{" "}
            <span className="text-sweater-2">{firstTrack.album["#text"]}</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default LastFmRecent;
