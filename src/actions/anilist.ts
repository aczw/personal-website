import { ActionError, defineAction } from "astro:actions";
import { z } from "astro/zod";

import query from "@/actions/anilist-query.graphql?raw";

import { checkResponse, checkSafeParse } from "@/actions/common";

const ANILIST_API_URL = "https://graphql.anilist.co";
const ANILIST_USER_ID = 5422717;

const variables = {
  userId: ANILIST_USER_ID,
  sort: "ID_DESC",
  page: 1,
  perPage: 15,
  typeIn: ["ANIME_LIST", "MANGA_LIST"],
};

const MediaTitleSchema = z.object({
  english: z.string().nullable(),
  romaji: z.string().nullable(),
  native: z.string(),
});

const QuerySchema = z.object({
  data: z.object({
    Page: z.object({
      activities: z.array(
        z.object({
          createdAt: z.number(),
          media: z.object({
            title: MediaTitleSchema,
            coverImage: z.object({
              medium: z.string(),
            }),
            siteUrl: z.string(),
            id: z.number(),
          }),
          progress: z.string().nullable(),
          status: z.string(),
          type: z.enum(["ANIME_LIST", "MANGA_LIST"]),
        }),
      ),
    }),
  }),
  errors: z
    .array(
      z.object({
        message: z.string(),
        status: z.number(),
      }),
    )
    .optional(),
});

function checkAniListResponse(response: Response) {
  checkResponse(response, "Request to AniList failed!");
}

const aniList = {
  getRecentActivity: defineAction({
    input: undefined,
    handler: async () => {
      const response = await fetch(ANILIST_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      checkAniListResponse(response);
      const result = QuerySchema.safeParse(await response.json());
      checkSafeParse(result);

      const {
        data: {
          Page: { activities },
        },
        errors,
      } = result.data!;

      if (activities.length === 0) {
        throw new ActionError({
          code: "NOT_FOUND",
          message: "No activities found.",
        });
      }

      if (errors) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Errors returned in AniList request. Errors: ${errors.map((error) => error.message).join(", ")}`,
        });
      }

      return activities.filter((activity) => !activity.status.includes("plan"));
    },
  }),
};

type AniListMediaTitle = z.infer<typeof MediaTitleSchema>;

export { aniList, type AniListMediaTitle };
