import { Link } from "@/components/react/link";
import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";

interface LastFmStats {
  user: {
    name: string;
    age: string;
    subscriber: string;
    realname: string;
    bootstrap: string;
    playcount: string;
    artist_count: string;
    playlists: string;
    track_count: string;
    album_count: string;
    image: {
      size: "small" | "medium" | "large" | "extralarge";
      "#text": string;
    }[];
    registered: {
      unixtime: string;
      "#text": number;
    };
    country: string;
    gender: string;
    url: string;
    type: string;
  };
}

const key = `https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=ashzw&api_key=${
  import.meta.env.PUBLIC_LASTFM_KEY
}&format=json`;

const LastFmStats = () => {
  const { data: profile, isLoading } = useSWR<LastFmStats>(key, fetcher);

  if (isLoading) {
    return (
      <div className="flex h-12 animate-pulse items-center justify-center rounded-md bg-sweater-8 text-sweater-6" />
    );
  }

  const blurb = (
    <>
      I really like music and{" "}
      <Link
        href="https://www.last.fm/user/ashzw/"
        title="I really like tracking it."
        newTab
      >
        I really like tracking it.
      </Link>
    </>
  );

  if (!profile) {
    return (
      <p>
        {blurb} According to Last.fm, I listen to an average of{" "}
        <span className="text-sweater-2">~55</span> tracks daily.
      </p>
    );
  }

  return (
    <p className="animate-fade-in">
      {blurb} I currently have{" "}
      <span className="text-sweater-2">{profile.user.playcount}</span> total
      scrobbles.
    </p>
  );
};

export default LastFmStats;
