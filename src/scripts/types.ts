import type { CollectionEntry } from "astro:content";

import { type Icon as IconType } from "@lucide/astro";

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

export { type EntryKind, type MetaKind, type LinkWithIcon };
