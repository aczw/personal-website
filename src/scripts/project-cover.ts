class ProjectCover extends HTMLElement {
  externallyPaused: boolean;

  #hasVideo: boolean;
  #video: HTMLVideoElement | undefined;
  #wrapper: HTMLDivElement | undefined;

  constructor() {
    super();

    this.externallyPaused = false;

    // Note: data-* values automatically become camel case, so the key is
    // actually "useVideo" not "use-video"
    this.#hasVideo = this.dataset["useVideo"] === "true";

    if (this.#hasVideo) {
      this.#video = this.querySelector("video")!;
      this.#wrapper = this.querySelector("div")!;
    }
  }

  connectedCallback() {
    if (!this.#hasVideo) return;

    // Unless the video is already able to be played to the end without buffering, we attach
    // an event listener that displays and plays the video only when it's able to
    if (this.#video!.readyState !== HTMLMediaElement.HAVE_ENOUGH_DATA) {
      this.#video!.addEventListener("canplaythrough", () => this.playVideo());
    } else {
      this.playVideo();
    }
  }

  playVideo() {
    if (!this.#hasVideo) return;

    // User may have chosen to pause all videos on the page externally using the
    // ProjectCoverControls button. We respect that choice here and don't play this video
    if (this.externallyPaused) return;

    this.#video!.play();
    this.#wrapper!.style.opacity = "100";
  }

  pauseVideo() {
    if (!this.#hasVideo) return;

    this.#video!.pause();
    this.#wrapper!.style.opacity = "0";
  }
}

export { ProjectCover };
