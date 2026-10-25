import { capitalize, getShortDateFormatting } from "@/scripts/util";
import {
  getEntry,
  type CollectionEntry,
  type CollectionKey,
} from "astro:content";

/**
 * Essentially maps to every unique page on the site except for
 * content collection entries.
 */
type Route =
  | "about"
  | "art"
  | "changelog"
  | "colophon"
  | "covers"
  | "design"
  | "games"
  | "index"
  | "posts"
  | "projects"
  | "404"
  | "home";

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
type Head = {
  title: string;
  description: string;
};

const extractHeadInformation = async (meta: Meta): Promise<Head> => {
  switch (meta.kind) {
    case "route": {
      const title = (() => {
        switch (meta.route) {
          case "covers":
            return "Cover art";
          case "posts":
            return "Writing";
          case "404":
            return "Page not found";
          case "home":
            return "";

          default:
            return capitalize(meta.route);
        }
      })();

      return {
        title,
        description: meta.description,
      };
    }

    case "projects": {
      const { data } = meta.projectsEntry;
      return {
        title: data.name,
        description: data.description.long,
      };
    }

    case "projectPages": {
      const { data } = meta.projectPagesEntry;
      const projectId = meta.projectPagesEntry.id.split("/")[0]!;

      const projectEntry = await getEntry("projects", projectId)!;

      return {
        title: `${data.title} / ${projectEntry.data.name}`,
        description: data.description,
      };
    }

    case "posts": {
      const { data } = meta.postsEntry;
      const description =
        data.description !== undefined ?
          data.description
        : `Posted on ${getShortDateFormatting(data.posted)}`;

      return {
        title: data.title,
        description,
      };
    }

    case "games": {
      const { data } = meta.gamesEntry;
      return {
        title: data.title,
        description: data.description,
      };
    }

    case "covers": {
      const { data } = meta.coversEntry;
      return {
        title: `Cover art for ${data.title}`,
        description: `Custom cover art for ${data.title}`,
      };
    }

    case "design": {
      const { data } = meta.designEntry;
      return {
        title: data.title,
        description: `${data.type} design by me`,
      };
    }

    case "designPages": {
      const { data } = meta.designPagesEntry;
      const designId = meta.designPagesEntry.id.split("/")[0]!;

      const designEntry = await getEntry("design", designId)!;

      return {
        title: `${data.title} / ${designEntry.data.title}`,
        description: `${data.type} by me`,
      };
    }

    case "art": {
      const { data } = meta.artEntry;
      return {
        title: data.title,
        description: "Artwork by me",
      };
    }

    case "changelog": {
      const { data } = meta.changelogEntry;
      return {
        title: `v${meta.changelogEntry.id}`,
        description: `Changelog for v${meta.changelogEntry.id} of my website, released on ${getShortDateFormatting(data.date)}.`,
      };
    }

    default:
      throw new Error("Unhandled meta kind!");
  }
};

export { type Meta, extractHeadInformation };
