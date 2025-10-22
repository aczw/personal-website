import {
  FileUserIcon,
  LinkedinIcon,
  GithubIcon,
  MailIcon,
} from "@lucide/astro";

const CDN_URL = "https://cdn.charleszw.com";
const PROJECT_CATEGORIES = ["graphics", "games", "art"] as const;
const VALID_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DISABLED_PROJECTS = ["dgdg", "deth"];

function getSocials() {
  return [
    { href: "/_files/resume.pdf", label: "Resume", icon: FileUserIcon },
    {
      href: "https://linkedin.com/in/zwcharl",
      label: "LinkedIn",
      icon: LinkedinIcon,
    },
    { href: "https://github.com/aczw", label: "GitHub", icon: GithubIcon },
    { href: "mailto:zwcharl@gmail.com", label: "Email", icon: MailIcon },
  ];
}

export {
  CDN_URL,
  PROJECT_CATEGORIES,
  VALID_MONTHS,
  DISABLED_PROJECTS,
  getSocials,
};
