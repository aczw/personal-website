import type portfolioJson from "@/assets/portfolio/portfolio.json";
import type projectsJson from "@/assets/projects/projects.json";

type Project = (typeof projectsJson)[0];
type Portfolio = (typeof portfolioJson)[0];

export type { Portfolio, Project };
