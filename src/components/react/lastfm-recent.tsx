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
    <h3 className="mb-4 font-mono text-sm font-bold text-sweater-2 xl:mb-0">
      Current status
    </h3>
  );

  if (isLoading) {
    return (
      <>
        {header}
        {/* 110px (image) + 24px (text) + 16px (padding) */}
        <div className="h-[calc(110px+24px+theme(spacing.4))] w-full animate-pulse rounded-md bg-sweater-9 xl:h-full xl:bg-sweater-8" />
      </>
    );
  }

  const firstTrack = recent?.recenttracks.track[0];

  if (!firstTrack) {
    return (
      <>
        {/* this makes sure the height remains 154px */}
        <div className="mb-[calc(theme(spacing.6)+5px)] xl:mb-0">
          {header}
          <p className="animate-fade [--delay:0s]">
            I can't seem to load my most recent song.
          </p>
        </div>
        <p className="mb-[calc(theme(spacing.6)+5px)] flex animate-fade justify-between text-sweater-2 [--delay:0s] xl:mb-0">
          <span>(；´д｀)</span>
          <span>щ(゜ロ゜щ)</span>
          <span>(っ °Д °;)っ</span>
        </p>
        <p className="animate-fade [--delay:0s]">
          This might be because Last.fm is down. You can instead check out{" "}
          <Link
            href="https://www.last.fm/user/ashzw"
            newTab
          >
            my profile here!
          </Link>{" "}
          But, given the situation...
        </p>
      </>
    );
  }

  const nowPlaying = firstTrack["@attr"]
    ? firstTrack["@attr"].nowplaying === "true"
    : false;

  return (
    <>
      <div className="mb-4 xl:mb-0">
        {header}
        <p className="animate-fade [--delay:0s]">
          {nowPlaying
            ? "I'm currently listening to this song."
            : "This is the last song I was listening to."}{" "}
          <Link
            href="https://www.last.fm/user/ashzw"
            newTab
          >
            Really!
          </Link>
        </p>
      </div>
      <div className="flex animate-fade items-center space-x-6 [--delay:0s]">
        <img
          src={firstTrack.image[2]["#text"]}
          alt={`Album art for ${firstTrack.name}`}
          className="h-[110px] w-[110px] shrink-0 rounded bg-sweater-9 xl:bg-sweater-8"
        />
        <div className="flex flex-col">
          <h4 className="line-clamp-2 text-sweater-2">{firstTrack.name}</h4>
          <p className="line-clamp-1">
            by{" "}
            <span className="text-sweater-2">{firstTrack.artist["#text"]}</span>
          </p>
          <p className="line-clamp-1">
            from{" "}
            <span className="text-sweater-2">{firstTrack.album["#text"]}</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default LastFmRecent;
