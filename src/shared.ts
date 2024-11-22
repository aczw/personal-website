import type { CollectionEntry } from "astro:content";

type EntryKind =
  | { kind: "post"; post: CollectionEntry<"posts">; status: string }
  | { kind: "project"; project: CollectionEntry<"projects"> };

type MetaKind =
  | { kind: "route"; title: string | null; description: string; ogImageParams: string }
  | EntryKind;

// Referenced in both ProjectCover and ProjectCoverControls, hence why it's placed here
class ProjectCover extends HTMLElement {
  externallyPaused: boolean;

  #video: HTMLVideoElement;
  #wrapper: HTMLDivElement;

  constructor() {
    super();

    this.externallyPaused = false;
    this.#video = this.querySelector("video")!;
    this.#wrapper = this.querySelector("div")!;
  }

  connectedCallback() {
    // Unless the video is already able to be played to the end without buffering, we attach
    // an event listener that displays and plays the video only when it's able to
    if (this.#video.readyState !== HTMLMediaElement.HAVE_ENOUGH_DATA) {
      this.#video.addEventListener("canplaythrough", () => this.playVideo());
    } else {
      this.playVideo();
    }
  }

  playVideo() {
    // User may have chosen to pause all videos on the page externally using the
    // ProjectCoverControls button. We respect that choice here and don't play this video
    if (this.externallyPaused) return;

    this.#video.play();
    this.#wrapper.style.opacity = "100";
  }

  pauseVideo() {
    this.#video.pause();
    this.#wrapper.style.opacity = "0";
  }
}

export { type MetaKind, type EntryKind, ProjectCover };
