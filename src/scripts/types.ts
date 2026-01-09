import type { CollectionEntry } from "astro:content";
import type { z } from "astro/zod";

import type {
  DateSchema,
  RangedDateSchema,
  SimpleDateSchema,
} from "@/scripts/schema";

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

type SimpleDate = z.infer<typeof SimpleDateSchema>;
type RangedDate = z.infer<typeof RangedDateSchema>;
type ContentDateType = z.infer<typeof DateSchema>;

type DateKind =
  | { kind: "simple"; date: SimpleDate }
  | { kind: "ranged"; date: RangedDate };

export type {
  EntryKind,
  MetaKind,
  SimpleDate,
  RangedDate,
  ContentDateType,
  DateKind,
};
