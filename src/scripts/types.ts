import type { CollectionEntry, CollectionKey } from "astro:content";
import type { z } from "astro/zod";

import type {
  DateSchema,
  RangedDateSchema,
  SimpleDateSchema,
} from "@/scripts/schema";
import type { ROUTES } from "@/scripts/constants";

type Route = (typeof ROUTES)[number];

/**
 * Maps every content collection name to a literal "kind" and creates a
 * discriminated union out of all collections.
 */
type CollectionKind = {
  [Collection in CollectionKey]: {
    kind: Collection;
  } & {
    [K in Collection as `${K}Entry`]: CollectionEntry<Collection>;
  };
}[CollectionKey];

type Meta =
  | { kind: "route"; route: Route; description: string }
  | CollectionKind;
type MetaKind = Meta["kind"];

type SimpleDate = z.infer<typeof SimpleDateSchema>;
type RangedDate = z.infer<typeof RangedDateSchema>;
type ContentDate = z.infer<typeof DateSchema>;

type DateKind =
  | { kind: "simple"; date: SimpleDate }
  | { kind: "ranged"; date: RangedDate };

type HeaderLink = { href: string; text: string };

export type {
  Meta,
  MetaKind,
  SimpleDate,
  RangedDate,
  ContentDate,
  DateKind,
  HeaderLink,
};
