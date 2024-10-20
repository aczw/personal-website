import type { CollectionEntry } from "astro:content";

type EntryKind =
  | { kind: "post"; post: CollectionEntry<"posts">; status: string }
  | { kind: "project"; project: CollectionEntry<"projects"> };

type MetaKind =
  | { kind: "route"; title: string | null; description: string; ogImageParams: string }
  | EntryKind;

export type { MetaKind, EntryKind };
