type ProjectCoverKind =
  | { hasVideo: true; video: HTMLVideoElement; wrapper: HTMLDivElement }
  | { hasVideo: false };

class ProjectCover extends HTMLElement {
  readonly kind: ProjectCoverKind;
  externallyPaused: boolean;

  constructor() {
    super();

    this.externallyPaused = false;
    this.kind = { hasVideo: false };

    // data-* values automatically become camel case, so the key is
    // actually "useVideo" not "use-video"
    if (this.dataset["useVideo"] === "true") {
      const videoElt = this.querySelector("video");
      const wrapperDivElt = this.querySelector("div");

      if (!videoElt || !wrapperDivElt) {
        throw new Error(
          "ProjectCover claims to has video but doesn't contain video or wrapper div element",
        );
      }

      this.kind = { hasVideo: true, video: videoElt, wrapper: wrapperDivElt };
    }
  }

  connectedCallback() {
    if (!this.kind.hasVideo) return;

    if (this.kind.video.readyState !== HTMLMediaElement.HAVE_ENOUGH_DATA) {
      this.kind.video.addEventListener("canplaythrough", () => this.playVideo());
    } else {
      this.playVideo();
    }
  }

  playVideo() {
    if (!this.kind.hasVideo) return;

    // User may have chosen to pause all videos on the page externally using the
    // ProjectCoverControls button. We respect that choice here and don't play this video
    if (this.externallyPaused) return;

    this.kind.video.play().catch((error) => console.error(error));
    this.kind.wrapper.style.opacity = "100";
  }

  pauseVideo() {
    if (!this.kind.hasVideo) return;

    this.kind.video.pause();
    this.kind.wrapper.style.opacity = "0";
  }
}

export { ProjectCover };
