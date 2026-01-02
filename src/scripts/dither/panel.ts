import { Pane, type BladeApi } from "tweakpane";
import * as TpEssentialsPlugin from "@tweakpane/plugin-essentials";
import type { FpsGraphBladeApi } from "@tweakpane/plugin-essentials";

import {
  BayerMatrixSize,
  DitherMode,
  type Dither,
} from "@/scripts/dither/types";
import { applyDitherSettings, DITHER_PRESETS } from "@/scripts/dither/presets";

type PanelFpsGraphs = {
  draw: FpsGraphBladeApi;
  video: FpsGraphBladeApi;
};

type Panel = {
  pane: Pane;
  container: HTMLDivElement;
  animations: {
    show: () => void;
    hide: () => void;
  };
  fpsGraphs: PanelFpsGraphs;
};

const SHOW_PANEL_KEYFRAMES: Keyframe[] = [
  { transform: "scale(0.97)" },
  { transform: "scale(1)" },
];
const SHOW_PANEL_OPTIONS: KeyframeAnimationOptions = {
  duration: 100,
  easing: "ease-out",
  fill: "forwards",
};

const HIDE_PANEL_KEYFRAMES: Keyframe[] = [{ opacity: 1 }, { opacity: 0 }];
const HIDE_PANEL_OPTIONS: KeyframeAnimationOptions = {
  duration: 110,
  easing: "ease-in",
  fill: "forwards",
};

function initializePanel(dither: Dither): Panel {
  const container = document.createElement("div");
  container.id = "panel-container";
  container.style.position = "absolute";
  container.style.top = "var(--spacing-pad)";
  container.style.right = "var(--spacing-pad)";
  container.style.width = "285px";
  // Assumes these Tailwind classes are used somewhere else, otherwise they
  // won't be generated and this won't work.
  container.classList.add("hidden", "md:block");

  const pane = new Pane({
    title: "Panel",
    container,
  });
  pane.registerPlugin(TpEssentialsPlugin);

  const draw = pane.addBlade({
    view: "fpsgraph",
    label: "FPS",
    min: 0,
    max: 120,
    rows: 2,
  }) as FpsGraphBladeApi;

  draw.on("tick", (ev) => {
    // Dynamically adjust FPS max bound
    if (ev.target.fps && ev.target.fps > ev.target.max) {
      ev.target.max = ev.target.fps + 60;
    }
  });

  const video = pane.addBlade({
    view: "fpsgraph",
    label: "Video",
    min: 0,
    max: 120,
    rows: 1,
  }) as FpsGraphBladeApi;

  pane.addBinding(dither, "canvasSize", {
    readonly: true,
    label: "Dimensions",
  });
  pane.addBinding(dither, "backend", {
    readonly: true,
    label: "Backend",
  });

  const tab = pane.addTab({
    pages: [{ title: "Configuration" }, { title: "Presets" }],
  });
  const settings = tab.pages[0]!;
  const presets = tab.pages[1]!;

  {
    settings
      .addBinding(dither.general, "mode", {
        label: "Mode",
        options: {
          "Noise-based": DitherMode.NOISE,
          Ordered: DitherMode.ORDERED,
        },
      })
      .on("change", (ev) => {
        const isHidden = ev.value === DitherMode.NOISE;
        orderedSettings.forEach((blade) => (blade.hidden = isHidden));
      });

    settings.addBinding(dither.general, "uvPixelSize", {
      label: "Pixel size",
      min: 1,
      step: 1,
    });

    settings.addBinding(dither.general, "numQuantizedColors", {
      label: "Color count",
      min: 2,
      max: 32,
      step: 1,
    });

    settings.addBinding(dither.general, "bias", {
      label: "Bias",
      min: -1.0,
      max: 1.0,
      step: 0.01,
    });

    settings.addBlade({ view: "separator" });

    settings.addBinding(dither.color, "a", {
      label: "Color A",
      color: { type: "float" },
      picker: "inline",
    });

    settings.addBinding(dither.color, "b", {
      label: "Color B",
      color: { type: "float" },
      picker: "inline",
    });

    // Not hidden by default
    const orderedSettings: BladeApi[] = [
      settings.addBlade({ view: "separator" }),
      settings.addBinding(dither.ordered, "bayerMatrixSize", {
        label: "Bayer matrix",
        options: {
          "2×2": BayerMatrixSize.TWO_BY_TWO,
          "4×4": BayerMatrixSize.FOUR_BY_FOUR,
          "8×8": BayerMatrixSize.EIGHT_BY_EIGHT,
        },
      }),
      settings.addBinding(dither.ordered, "ditheredSize", {
        label: "Dither size",
        min: 1,
        step: 1,
      }),
    ];
  }

  DITHER_PRESETS.forEach((preset, index) => {
    const title =
      index > 1 ? `${index - 1}`
      : index === 1 ? "Default light mode"
      : "Default dark mode";

    presets.addButton({ title }).on("click", () => {
      applyDitherSettings(dither, preset);
      settings.refresh();
    });
  });

  return {
    pane,
    container,
    animations: {
      show: () => {
        container
          .animate(SHOW_PANEL_KEYFRAMES, SHOW_PANEL_OPTIONS)
          .addEventListener("finish", (ev) =>
            (ev.currentTarget as Animation).cancel(),
          );
        pane.hidden = false;
      },
      hide: () => {
        container
          .animate(HIDE_PANEL_KEYFRAMES, HIDE_PANEL_OPTIONS)
          .addEventListener("finish", (ev) => {
            pane.hidden = true;
            (ev.currentTarget as Animation).cancel();
          });
      },
    },
    fpsGraphs: { draw, video },
  };
}

export { initializePanel, type PanelFpsGraphs, type Panel };
