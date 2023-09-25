import useSWR from "swr";

interface LastFmRecents {
  weeklytrackchart: {
    track: {
      artist: { mbid: string; "#text": string };
      image: { size: "small" | "medium" | "large"; "#text": string }[];
      mbid: string;
      url: string;
      name: string;
      "@attr": {
        rank: string;
      };
      playcount: string;
    }[];
    "@attr": {
      from: string;
      user: string;
      to: string;
    };
  };
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const LastFmRecents = ({ apiKey }: { apiKey: string }) => {
  const key = `https://ws.audioscrobbler.com/2.0/?method=user.getweeklytrackchart&user=ashzw&api_key=${apiKey}&format=json`;

  const { data: tracks, isLoading } = useSWR<LastFmRecents, Error>(
    key,
    fetcher,
  );

  if (isLoading) {
    return (
      <div className="flex h-12 animate-pulse items-center justify-center rounded-md bg-sweater-8 text-sweater-6">
        Fetching most listened to tracks...
      </div>
    );
  }

  const topThree = tracks?.weeklytrackchart.track.slice(0, 3);

  if (!topThree) {
    return <p>{"No tracks found :("}</p>;
  }

  return (
    <p className="xs:line-clamp-2">
      My top tracks this week are{" "}
      <a
        href={topThree[0].url}
        target="_blank"
        className="text-sweater-3 transition-colors hover:text-sweater-1 hover:underline"
      >
        {topThree[0].name}
      </a>{" "}
      ({topThree[0].playcount} times),{" "}
      <a
        href={topThree[1].url}
        target="_blank"
        className="text-sweater-3 transition-colors hover:text-sweater-1 hover:underline"
      >
        {topThree[1].name}
      </a>{" "}
      ({topThree[1].playcount} times), and{" "}
      <a
        href={topThree[2].url}
        target="_blank"
        className="text-sweater-3 transition-colors hover:text-sweater-1 hover:underline"
      >
        {topThree[2].name}
      </a>{" "}
      ({topThree[2].playcount} times).
    </p>
  );
};

export default LastFmRecents;
