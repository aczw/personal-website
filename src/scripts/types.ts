import type { z } from "astro/zod";

import type {
  DateSchema,
  RangedDateSchema,
  SimpleDateSchema,
} from "@/scripts/schema";

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

export type { SimpleDate, RangedDate, ContentDate, DateKind, Err, Result };
