import { ActionError } from "astro:actions";
import { type ZodSafeParseResult } from "astro/zod";

const checkResponse = (response: Response, initialMessage: string) => {
  if (!response.ok) {
    let message = initialMessage;

    if (response.statusText.length !== 0) {
      message += ` Server message: ${response.statusText}`;
    }

    throw new ActionError({
      code: "INTERNAL_SERVER_ERROR",
      message,
    });
  }
};

const checkSafeParse = <Out>(result: ZodSafeParseResult<Out>) => {
  if (!result.success) {
    console.error("[Zod]", result.error.issues);

    throw new ActionError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to parse response!",
    });
  }
};

export { checkResponse, checkSafeParse };
