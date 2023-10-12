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
    <h3 className="w-fit font-mono text-sm font-bold text-sweater-2">
      Current status
    </h3>
  );

  if (isLoading) {
    return (
      <>
        {header}
        <div className="h-full w-full animate-pulse rounded-md bg-sweater-8" />
      </>
    );
  }

  const firstTrack = recent?.recenttracks.track[0];

  if (!firstTrack) {
    return (
      <>
        <div>
          {header}
          <p className="animate-fade [--delay:0s]">
            I can&apos;t seem to load my most recent song.
          </p>
        </div>
        <p className="flex animate-fade justify-between text-sweater-2 [--delay:0s]">
          <span>(；´д｀)</span>
          <span>щ(゜ロ゜щ)</span>
          <span>(っ °Д °;)っ</span>
        </p>
        <p className="animate-fade [--delay:0s]">
          This might be because Last.fm is down. You can find{" "}
          <Link
            href="https://www.last.fm/user/ashzw"
            newTab
          >
            my profile here!
          </Link>{" "}
          But given the situation...
        </p>
      </>
    );
  }

  const nowPlaying = firstTrack["@attr"]
    ? firstTrack["@attr"].nowplaying === "true"
    : false;

  return (
    <>
      <div>
        {header}
        <p className="animate-fade [--delay:0s]">
          {nowPlaying
            ? "I'm currently listening to this song."
            : "This is the last song I listened to."}{" "}
          <Link
            href="https://www.last.fm/user/ashzw"
            newTab
          >
            Really!
          </Link>
        </p>
      </div>
      <div className="flex animate-fade items-center space-x-5 [--delay:0s]">
        <img
          src={firstTrack.image[2]["#text"]}
          alt={`Album art for ${firstTrack.name}`}
          className="h-[80px] w-[80px] rounded bg-sweater-8 xs:h-[85px] xs:w-[85px] 2xl:h-[110px] 2xl:w-[110px]"
        />
        <div className="flex flex-col">
          <h4 className="text-sweater-2">{firstTrack.name}</h4>
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
