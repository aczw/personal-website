import type portfolioJson from "@/assets/portfolio/portfolio.json";
import type projectsJson from "@/assets/projects/projects.json";

// TS currently interprets enums as just strings, so we manually override it
// see https://github.com/microsoft/TypeScript/issues/32063
type Portfolio = Omit<(typeof portfolioJson)[0], "type"> & {
  type: "design" | "art" | "music";
};

type Project = (typeof projectsJson)[0];

export type { Portfolio, Project };
