type SongLyrics = {
  song: string;
  lyrics: string[];
};

type FlatLyrics = SongLyrics & { artist: string };

type ArtistGroup = {
  artist: string;
  songs: SongLyrics[];
};

const lyrics: ArtistGroup[] = [
  {
    artist: "Porter Robinson",
    songs: [
      {
        song: "Hollowheart",
        lyrics: ["You carve into the bridge", "It might not be so bad to die"],
      },
      {
        song: "Flicker",
        lyrics: ["自分たちの生活のトラックを失う方法です"],
      },
      {
        song: "Musician",
        lyrics: ["I burn up, burn out", "I shouldn't do this to myself"],
      },
      {
        song: "Get Your Wish",
        lyrics: ["But don't you waste the suffering you've faced"],
      },
      {
        song: "Something Comforting",
        lyrics: ["If I send this void away", "Have I lost a part of me?"],
      },
      {
        song: "Russian Roulette",
        lyrics: ["Maybe this time I won't be alright", "Maybe this time"],
      },
    ],
  },
  // We do a little lying
  {
    artist: "OMORI",
    songs: [
      {
        song: "MEWO",
        lyrics: ["Waiting for something to happen?"],
      },
    ],
  },
  {
    artist: "Mac Miller",
    songs: [
      {
        song: "Friends",
        lyrics: [
          "We forgot our roots before and trust me, things they fell apart",
        ],
      },
      {
        song: "New Faces V2",
        lyrics: ["You are drinkin' from a shallow soul"],
      },
      {
        song: "Jet Fuel",
        lyrics: ["Well, I'ma be here for a while, longer than I did expect to"],
      },
      {
        song: "Jet Fuel",
        lyrics: ["But I never run out of jet fuel"],
      },
    ],
  },
  {
    artist: "Origami Angel",
    songs: [
      {
        song: "Doctor Whomst",
        lyrics: [
          "I think I'm starting to like myself",
          "I think I'm right where I need to be",
        ],
      },
    ],
  },
  {
    artist: "underscores",
    songs: [
      {
        song: "Your favorite sidekick",
        lyrics: [
          "We're so right 'bout everything that we say",
          "We're so cool",
        ],
      },
      {
        song: "Kinko's field trip 2006",
        lyrics: [
          "Never have I ever, no, I haven't",
          "And I bet I probably won't",
        ],
      },
      {
        song: "Kinko's field trip 2006",
        lyrics: [
          "Shed some confidence 'cause I don't wanna have to pretend",
          "(Anymore)",
        ],
      },
      {
        song: "Kinko's field trip 2006",
        lyrics: ["Tell me, if it's not on purpose, why'd you do it again?"],
      },
      {
        song: "Kinko's field trip 2006",
        lyrics: [
          "Just admit it, you don't have a world that you're up against",
        ],
      },
      {
        song: "Bozo bozo bozo",
        lyrics: [
          "I would give you all the things that I should keep to myself",
        ],
      },
    ],
  },
  {
    artist: "The Strokes",
    songs: [
      {
        song: "Is This It",
        lyrics: ["Can't you see I'm trying?", "I don't even like it"],
      },
    ],
  },
  {
    artist: "Ecco2k",
    songs: [
      {
        song: "AAA Powerline",
        lyrics: ["Ziptied up, can't move my arms"],
      },
    ],
  },
  {
    artist: "Isaiah Rashad",
    songs: [
      {
        song: "Tity and Dolla",
        lyrics: [
          "Just wanna be like one of them",
          "But now I don't, I ran away",
          "I ran away, I ran away",
        ],
      },
    ],
  },
  {
    artist: "Injury Reserve",
    songs: [
      {
        song: "ttktv",
        lyrics: ["And I hardly fall apart, but this time I'm diminished"],
      },
    ],
  },
  {
    artist: "Run the Jewels",
    songs: [
      {
        song: "Thursday in the Danger Room",
        lyrics: [
          "And I guess I'd say I'll see you soon",
          "But the truth is that I see you now",
        ],
      },
    ],
  },
  {
    artist: "Twenty One Pilots",
    songs: [
      {
        song: "My Blood",
        lyrics: ["No, you don't need to run", "Stay with me, my blood"],
      },
      {
        song: "Ode to Sleep",
        lyrics: [
          "I'll tell 'em",
          "You have no plans for me",
          "I will set my soul on fire",
        ],
      },
    ],
  },
  {
    artist: "Car Seat Headrest",
    songs: [
      {
        song: "High to Death",
        lyrics: [
          "It's the middle of the night",
          "And I'll never be alright again",
        ],
      },
    ],
  },
  {
    artist: "adore",
    songs: [
      {
        song: "dancing while the world burns",
        lyrics: [
          "Sway back and forth",
          "Hit the floor",
          "Find someone to die for",
        ],
      },
    ],
  },
  {
    artist: "Migos",
    songs: [
      {
        song: "T-Shirt",
        lyrics: ["Divin' off the stage in the crowd, it's a mosh pit"],
      },
    ],
  },
  {
    artist: "Bedwetter",
    songs: [
      {
        song: "Stoop Lights",
        lyrics: ["Sit and watch the stoop lights flicker"],
      },
    ],
  },
  {
    artist: "Good Tiger",
    songs: [
      {
        song: "If You Weren't My Son I'd Hug You",
        lyrics: ["And I've been thinking for days", "Trying to find my worth"],
      },
    ],
  },
  {
    artist: "I Love Your Lifestyle",
    songs: [
      {
        song: "Stupid",
        lyrics: [
          "So stupid",
          "So put your hands down",
          "Don't try to sing along",
        ],
      },
    ],
  },
  {
    artist: "aldn",
    songs: [
      {
        song: "do or die",
        lyrics: [
          "We can't keep this up",
          "I'm worried you might have a breakdown",
        ],
      },
    ],
  },
  {
    artist: "Foo Fighters",
    songs: [
      {
        song: "Everlong",
        lyrics: ["Breathe out", "So I can breathe you in", "Hold you in"],
      },
    ],
  },
  {
    artist: "Sipper",
    songs: [
      {
        song: "Dance In Room Song",
        lyrics: [
          "I get high off, high off",
          "Feeling half alive, well",
          "I don't wanna be a freak, I don't",
        ],
      },
    ],
  },
  {
    artist: "Beetlebug",
    songs: [
      {
        song: "overgrown garden",
        lyrics: ["You placed a crown of marigolds on my head"],
      },
    ],
  },
  {
    artist: "The Voidz",
    songs: [
      {
        song: "Pink Ocean",
        lyrics: [
          "I want out of this world",
          "I won't lie anymore, I can't love anymore",
        ],
      },
    ],
  },
  {
    artist: "Kanye West",
    songs: [
      {
        song: "I Thought About Killing You",
        lyrics: [
          "I love myself way more than I love you",
          "And I think about killing myself",
        ],
      },
    ],
  },
  {
    artist: "Daft Punk",
    songs: [
      {
        song: "Infinity Repeating (2013 Demo)",
        lyrics: [
          "It's not right, it's not true, it's not right",
          "It's not how we used to do",
        ],
      },
    ],
  },
  {
    artist: "Action Bronson",
    songs: [
      {
        song: "Terry",
        lyrics: ["There's no hit records on a demo", "No, don't hurt me again"],
      },
    ],
  },
  {
    artist: "Basement",
    songs: [
      {
        song: "Oversized",
        lyrics: [
          "Hand me your eyes, oversized",
          "I can see through my disguise",
        ],
      },
    ],
  },
  {
    artist: "Shiro Sagisu",
    songs: [
      {
        song: "Komm, süsser Tod",
        lyrics: [
          "I wish that I could turn back time",
          "'Cause now the guilt is all mine",
        ],
      },
    ],
  },
  {
    artist: "iyowa",
    songs: [
      {
        song: "Kyu-kurarin",
        lyrics: ["わたしきゅうくらりん"],
      },
    ],
  },
  {
    artist: "Carly Cosgrove",
    songs: [
      {
        song: "What Are You, A Cop?",
        lyrics: ["Too awful, too often", "To watch some new day walk in"],
      },
      {
        song: "Don't Lick The Swingset",
        lyrics: ["Have I met you half an hour ago or known you all my life?"],
      },
    ],
  },
  {
    artist: "Newgrounds Death Rugby",
    songs: [
      {
        song: "Cary",
        lyrics: ["Lately, everything has been fucking getting to me"],
      },
    ],
  },
  {
    artist: "saturdays at your place",
    songs: [
      {
        song: "i give in",
        lyrics: ["You're too bold", "To speak like you're invincible"],
      },
    ],
  },
  {
    artist: "Tigers Jaw",
    songs: [
      {
        song: "I Saw Water",
        lyrics: [
          "I just don't feel incredible",
          "But me, well of course I liked you",
        ],
      },
    ],
  },
  {
    artist: "Fail Better, Heal Faster",
    songs: [
      {
        song: "DNA Scam",
        lyrics: [
          "If you're having a bad relationship with yourself",
          "Then you won't have a good one with anyone else",
        ],
      },
    ],
  },
  {
    artist: "Heccra",
    songs: [
      {
        song: "Camp Algonquin",
        lyrics: [
          "Not everything is threatening, the world's not trying to eat me",
        ],
      },
    ],
  },
  {
    artist: "Michael Cera Palin",
    songs: [
      {
        song: "Portrait of a Woman on a Couch With Cats",
        lyrics: ["I'll see you when I'm feeling more eloquent"],
      },
      {
        song: "Portrait of a Woman on a Couch With Cats",
        lyrics: ["God willing then, I'll be easier to digest"],
      },
      {
        song: "Portrait of a Woman on a Couch With Cats",
        lyrics: ["But my wrist is now clean and my thoughts are more clear"],
      },
    ],
  },
  {
    artist: "The Hotelier",
    songs: [
      {
        song: "In Framing",
        lyrics: ["Got drained when the crutch became vampiracy"],
      },
    ],
  },
];

const flatLyrics: FlatLyrics[] = lyrics.flatMap(({ artist, songs }) =>
  songs.map(({ song, lyrics: lines }) => ({ artist, song, lyrics: lines })),
);

export { flatLyrics };
