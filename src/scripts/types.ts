import type { CollectionEntry } from "astro:content";
import type { z } from "astro/zod";

import { type Icon as IconType } from "@lucide/astro";

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

type LinkWithIcon = {
  href: string;
  label: string;
  icon: typeof IconType;
};

type SimpleDate = z.infer<typeof SimpleDateSchema>;
type RangedDate = z.infer<typeof RangedDateSchema>;
type ContentDateType = z.infer<typeof DateSchema>;

export type {
  EntryKind,
  MetaKind,
  LinkWithIcon,
  SimpleDate,
  RangedDate,
  ContentDateType,
};
