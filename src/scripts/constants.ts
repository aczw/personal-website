import {
  FileUserIcon,
  LinkedinIcon,
  GithubIcon,
  MailIcon,
} from "@lucide/astro";

const CDN_URL = "https://cdn.charleszw.com";

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

export { CDN_URL, getSocials };
