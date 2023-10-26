import { cn } from "@/utils/cn";

const Link = ({
  href,
  title,
  newTab = false,
  className,
  children,
}: {
  href: string;
  title?: string;
  newTab?: boolean;
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <a
      href={href}
      target={newTab ? "_blank" : "_self"}
      title={title}
      aria-label={title}
      className={cn(
        "w-fit text-ash-3 underline decoration-ash-3/50 decoration-1 underline-offset-2 transition hover:text-ash-1 hover:decoration-ash-1",
        className,
      )}
    >
      {children}
    </a>
  );
};

export { Link };
