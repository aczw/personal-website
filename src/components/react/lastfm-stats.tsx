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
      <div className="mb-4 flex h-6 max-h-6 animate-pulse rounded-md bg-sweater-9 xl:mb-0 xl:h-full xl:bg-sweater-8" />
    );
  }

  if (!profile) {
    return (
      <p className="mb-4 xl:mb-0">
        I listen to an average of <span className="text-sweater-2">55</span>{" "}
        tracks per day.
      </p>
    );
  }

  return (
    <p className="mb-4 animate-fade [--delay:0s] xl:mb-0">
      So far, I have{" "}
      <span className="text-sweater-2">{profile.user.playcount}</span> total
      scrobbles.
    </p>
  );
};

export { LastFmStats };
