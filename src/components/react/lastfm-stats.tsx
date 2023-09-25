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

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const LastFmStats = ({ apiKey }: { apiKey: string }) => {
  const key = `https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=ashzw&api_key=${apiKey}&format=json`;

  const { data: profile, isLoading } = useSWR<LastFmStats>(key, fetcher);

  if (isLoading) {
    return (
      <div className="flex h-12 animate-pulse items-center justify-center rounded-md bg-sweater-8 text-sweater-6">
        Getting profile stats...
      </div>
    );
  }

  if (!profile) {
    return (
      <p>
        I really like music and{" "}
        <a
          href="https://www.last.fm/user/ashzw/"
          target="_blank"
          className="text-sweater-3 transition-colors hover:text-sweater-1 hover:underline"
        >
          I really like tracking it.
        </a>{" "}
        According to Last.fm, I listen to an average of ~55 tracks daily.
      </p>
    );
  }

  return (
    <p>
      I really like music and{" "}
      <a
        href={profile.user.url}
        target="_blank"
        className="text-sweater-3 transition-colors hover:text-sweater-1 hover:underline"
      >
        I really like tracking it.
      </a>{" "}
      I currently have {profile.user.playcount} total scrobbles.
    </p>
  );
};

export default LastFmStats;
