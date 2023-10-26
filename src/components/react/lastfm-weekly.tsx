import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";

interface LastFmWeekly {
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

const calculateKey = () => {
  const now = new Date();
  const lastSeven = Math.floor(
    new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).getTime() /
      1000,
  );

  return `https://ws.audioscrobbler.com/2.0/?method=user.getweeklytrackchart&user=ashzw&limit=2&api_key=${
    import.meta.env.PUBLIC_LASTFM_KEY
  }&from=${lastSeven}&to=${Math.floor(now.getTime() / 1000)}&format=json`;
};

const LastFmWeekly = () => {
  const { data: tracks, isLoading } = useSWR<LastFmWeekly>(
    calculateKey(),
    fetcher,
  );

  if (isLoading) {
    return (
      <div className="bg-ash-9 xl:bg-ash-8 flex h-6 max-h-6 animate-pulse rounded-md xl:h-full" />
    );
  }

  const topThree = tracks?.weeklytrackchart.track.slice(0, 3);

  if (!topThree) {
    return (
      <p>
        My most listened to album is <span className="text-ash-2">Nurture</span>{" "}
        by <span className="text-ash-2">Porter Robinson,</span> but my favorite
        one is probably <span className="text-ash-2">Faces</span> by{" "}
        <span className="text-ash-2">Mac Miller.</span>
      </p>
    );
  }

  return (
    <p className="line-clamp-2 animate-fade [--delay:0s]">
      My current top track is{" "}
      <span className="text-ash-2">{topThree[0].name}</span>, played{" "}
      {topThree[0].playcount} times.
    </p>
  );
};

export default LastFmWeekly;
