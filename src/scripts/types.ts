import type { CollectionEntry, CollectionKey } from "astro:content";
import type { z } from "astro/zod";

import type {
  DateSchema,
  RangedDateSchema,
  SimpleDateSchema,
} from "@/scripts/schema";

/**
 * Essentially maps to every unique page on the site except for
 * content collection entries.
 */
type Route = "home" | "404" | "projects" | "posts" | "about";

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
  { kind: "route"; route: Route; description: string } | CollectionKind;
type MetaKind = Meta["kind"];

type SimpleDate = z.infer<typeof SimpleDateSchema>;
type RangedDate = z.infer<typeof RangedDateSchema>;
type ContentDate = z.infer<typeof DateSchema>;

type DateKind =
  { kind: "simple"; date: SimpleDate } | { kind: "ranged"; date: RangedDate };

type Err = { kind: "err"; message: string };
type Result<T> =
  | {
      kind: "ok";
      data: T;
    }
  | Err;

export type {
  Route,
  Meta,
  MetaKind,
  SimpleDate,
  RangedDate,
  ContentDate,
  DateKind,
  Err,
  Result,
};
