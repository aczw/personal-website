import {
  BayerMatrixSize,
  DitherMode,
  type Color,
  type DitherSettings,
} from "@/scripts/dither/types";

const CDN_URL = "https://cdn.charleszw.com";

const VALID_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Order matters! Project videos will be played in the order defined here.
 */
const HOMEPAGE_PROJECTS = [
  "catanks",
  "mini-minecraft",
  "webgpu-clustered",
  "door",
];
const DISABLED_PROJECTS = [
  "cuda-boids", // code
  "deth", // game
  "dgdg", // game
  "fireball", // code
  "glsl-path-tracer", // code
  "moore-chair", // visual
  "pbr-renderer", // code
  "racecar",
  "rcw", // game
];
const DISABLED_POSTS = ["dithering"];

// common to all: blurb, SimpleDateSchema, TechSchema, slug, number of teammates(opt, entering 0 is the same as undefined)

// visual: medium(3d|traditional|digital|cover-art)
// code: languages, libraries/frameworks, sourceHref(opt)
// game: store links, engine, sourceHref(opt)

/**
 * Corresponds to CSS var(--color-sweater-1).
 */
const SWEATER_1: Color = {
  r: 0.8823529411764706,
  g: 0.8745098039215686,
  b: 1.0,
};

/**
 * Corresponds to CSS var(--color-sweater-3).
 */
const SWEATER_3: Color = {
  r: 0.7647058823529411,
  g: 0.7411764705882353,
  b: 1.0,
};

/**
 * Corresponds to CSS var(--color-sweater-8).
 */
const SWEATER_8: Color = {
  r: 0.19215686274509805,
  g: 0.17647058823529413,
  b: 0.396078431372549,
};

/**
 * Corresponds to CSS var(--color-sweater-10).
 */
const SWEATER_10: Color = {
  r: 0.0392156862745098,
  g: 0.03529411764705882,
  b: 0.09803921568627451,
};

const DEFAULT_DARK_DITHER_SETTINGS: DitherSettings = {
  general: {
    mode: DitherMode.ORDERED,
    uvPixelSize: 48,
    numQuantizedColors: 6,
    bias: -0.08,
  },
  color: {
    a: SWEATER_10,
    b: SWEATER_8,
  },
  ordered: {
    bayerMatrixSize: BayerMatrixSize.EIGHT_BY_EIGHT,
    ditheredSize: 4,
  },
};

const DEFAULT_LIGHT_DITHER_SETTINGS: DitherSettings = {
  general: {
    mode: DitherMode.ORDERED,
    uvPixelSize: 48,
    numQuantizedColors: 6,
    bias: 0.0,
  },
  color: {
    a: SWEATER_1,
    b: SWEATER_3,
  },
  ordered: {
    bayerMatrixSize: BayerMatrixSize.EIGHT_BY_EIGHT,
    ditheredSize: 4,
  },
};

/**
 * Default icon size unless otherwise specified. Should stay in sync with
 * `var(--spacing-icon)` defined in main.css.
 */
const ICON_SIZE = 18;
const EYE_SIZE = 7;

const FLAVOR_TEXTS = [
  "Waiting for something to happen?",
  "You carve into the bridge / It might not be so bad to die",
  "We forgot our roots before and trust me, things they fell apart",
  "You are drinkin' from a shallow soul",
  "Well, I'ma be here for a while, longer than I did expect to",
  "But I never run out of jet fuel",
  "I think I'm starting to like myself / I think I'm right where I need to be",
  "We're so right 'bout everything that we say / We're so cool",
  "Just admit it, you don't have a world that you're up against",
  "Can't you see I'm trying? / I don't even like it",
  "Ziptied up, can't move my arms",
  "I burn up, burn out / I shouldn't do this to myself",
  "I stay, no fake, steamin' tea and Malibu",
  "Internet breath pushed out / By my digital lungs, sustains me",
  "These contagious idealizations aren't conserving any fuel",
  "Just wanna be like one of them / But now I don't, I ran away / I ran away, I ran away",
  "And I hardly fall apart, but this time I'm diminished",
  "I breathe in then I breathe out, keep on making carbon dioxide",
  "And I guess I'd say I'll see you soon / But the truth is that I see you now",
  "No, you don't need to run / Stay with me, my blood",
  "It's the middle of the night / And I'll never be alright again",
  "Sway back and forth / Hit the floor / Find someone to die for",
  "Divin' off the stage in the crowd, it's a mosh pit",
  "Sit and watch the stoop lights flicker",
  "And I've been thinking for days / Trying to find my worth",
  "Are you with that like I'm with that? / Hope you're watchin' your back",
  "I can touch my toes / Without bending over / What is happening to me?",
  "自分たちの生活のトラックを失う方法です",
  "So stupid / So put your hands down / Don't try to sing along",
  "We can't keep this up / I'm worried you might have a breakdown",
  "Breathe out / So I can breathe you in / Hold you in",
  "I get high off, high off / Feeling half alive, well / I don't wanna be a freak, I don't",
  "You placed a crown of marigolds on my head",
  "I want out of this world / I won't lie anymore, I can't love anymore",
  "I love myself way more than I love you / And I think about killing myself",
  "It's not right, it's not true, it's not right / It's not how we used to do",
  "It's not your fault / It's my own fault / I'm not human at all",
  "The disco ball in my mouth insinuates I'm ballin'",
  "There's no hit records on a demo / No, don't hurt me again",
  "Hand me your eyes, oversized / I can see through my disguise",
  "I wish that I could turn back time / 'Cause now the guilt is all mine",
  "I'll tell 'em / You have no plans for me / I will set my soul on fire",
];

export {
  CDN_URL,
  VALID_MONTHS,
  HOMEPAGE_PROJECTS,
  DISABLED_PROJECTS,
  DISABLED_POSTS,
  SWEATER_1,
  SWEATER_3,
  SWEATER_8,
  SWEATER_10,
  DEFAULT_DARK_DITHER_SETTINGS,
  DEFAULT_LIGHT_DITHER_SETTINGS,
  ICON_SIZE,
  EYE_SIZE,
  FLAVOR_TEXTS,
};
