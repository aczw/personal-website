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

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const LastFmRecent = ({ apiKey }: { apiKey: string }) => {
  const key = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=ashzw&api_key=${apiKey}&limit=1&format=json`;

  const { data: recent, isLoading } = useSWR<LastFmRecent>(key, fetcher);

  if (isLoading) {
    return (
      <>
        <div className="flex flex-col">
          <h4 className="w-fit font-bold text-sweater-2">Most recent track</h4>
          <p>Loading my most recent song...</p>
        </div>

        <div className="flex grow items-center space-x-5">
          <div className="h-[80px] w-[80px] shrink-0 animate-pulse rounded bg-sweater-8 2xl:h-[110px] 2xl:w-[110px]"></div>
          <div className="h-[72px] w-full animate-pulse rounded bg-sweater-8"></div>
        </div>
      </>
    );
  }

  const firstTrack = recent?.recenttracks.track[0];

  if (!firstTrack) {
    return <p>Sex</p>;
  }

  const nowPlaying = firstTrack["@attr"]
    ? firstTrack["@attr"].nowplaying === "true"
    : false;

  return (
    <>
      <div className="flex flex-col">
        <h4 className="w-fit font-bold text-sweater-2">
          {nowPlaying ? "Currently playing" : "Last listened to"}
        </h4>
        <p>
          {nowPlaying
            ? "I'm listening to this song right now!!"
            : "This is the last song I played."}
        </p>
      </div>

      <div className="flex grow items-center space-x-5">
        <img
          src={firstTrack.image[2]["#text"]}
          alt={`Song cover for ${firstTrack.name}`}
          className="h-[80px] w-[80px] rounded bg-sweater-8 2xl:h-[110px] 2xl:w-[110px]"
        />
        <div className="flex flex-col">
          <a
            href={firstTrack.url}
            target="_blank"
            className="w-fit text-sweater-3 transition-colors hover:text-sweater-1 hover:underline xs:line-clamp-1"
          >
            {firstTrack.name}
          </a>
          <p className="xs:line-clamp-1">by {firstTrack.artist["#text"]}</p>
          <p className="xs:line-clamp-1">from {firstTrack.album["#text"]}</p>
        </div>
      </div>
    </>
  );
};

export default LastFmRecent;
