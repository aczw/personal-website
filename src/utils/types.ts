import type designJson from "@/assets/design/design.json";
import type projectsJson from "@/assets/projects/projects.json";

type Project = (typeof projectsJson)[0];
type Design = (typeof designJson)[0];

export type { Design, Project };
