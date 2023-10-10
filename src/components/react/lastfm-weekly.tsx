import { Link } from "@/components/react/link";
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

  return `https://ws.audioscrobbler.com/2.0/?method=user.getweeklytrackchart&user=ashzw&limit=3&api_key=${
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
      <div className="flex h-12 animate-pulse items-center justify-center rounded-md bg-sweater-8 text-sweater-6 2xl:h-[72px]" />
    );
  }

  const topThree = tracks?.weeklytrackchart.track.slice(0, 3);

  if (!topThree) {
    return (
      <p>
        My top tracks couldn't be fetched for some reason... you can find what
        I've been listening to{" "}
        <Link
          href="https://www.last.fm/user/ashzw/library/tracks?date_preset=LAST_7_DAYS"
          newTab
        >
          here.
        </Link>
      </p>
    );
  }

  return (
    <p className="line-clamp-2 animate-fade [--delay:0s] 2xl:line-clamp-3">
      My top tracks in the last 7 days are{" "}
      <Link
        href={topThree[0].url}
        title={topThree[0].name}
        newTab
      >
        {topThree[0].name}
      </Link>{" "}
      ({topThree[0].playcount} times),{" "}
      <Link
        href={topThree[1].url}
        title={topThree[1].name}
        newTab
      >
        {topThree[1].name}
      </Link>{" "}
      ({topThree[1].playcount} times), and{" "}
      <Link
        href={topThree[2].url}
        title={topThree[2].name}
        newTab
      >
        {topThree[2].name}
      </Link>{" "}
      ({topThree[2].playcount} times).
    </p>
  );
};

export default LastFmWeekly;
