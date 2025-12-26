import type { CollectionEntry } from "astro:content";
import type { z } from "astro/zod";

import { type Icon as IconType } from "@lucide/astro";

import type {
  DateSchema,
  RangedDateSchema,
  SimpleDateSchema,
} from "@/scripts/schema";
import type { DitherMode } from "@/scripts/constants";

type EntryKind =
  | { kind: "post"; post: CollectionEntry<"posts"> }
  | { kind: "project"; project: CollectionEntry<"projects"> };

type MetaKind =
  | {
      kind: "route";
      title: string | null;
      description: string;
      ogImageParams: string;
    }
  | EntryKind;

type LinkWithIcon = {
  href: string;
  label: string;
  icon: typeof IconType;
};

type SimpleDate = z.infer<typeof SimpleDateSchema>;
type RangedDate = z.infer<typeof RangedDateSchema>;
type ContentDateType = z.infer<typeof DateSchema>;

type DateKind =
  | { kind: "simple"; date: SimpleDate }
  | { kind: "ranged"; date: RangedDate };

type DitherParameters = {
  canvasSize: string;
  backend: "WebGL 2" | "WebGPU";
  dither: {
    mode: (typeof DitherMode)[keyof typeof DitherMode];
    uvPixelSize: number;
    numQuantizedColors: number;
    bias: number;
  };
};

export type {
  EntryKind,
  MetaKind,
  LinkWithIcon,
  SimpleDate,
  RangedDate,
  ContentDateType,
  DateKind,
  DitherParameters,
};
