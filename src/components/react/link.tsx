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
        "w-fit text-sweater-3 underline decoration-sweater-3/50 underline-offset-2 transition-all hover:text-sweater-1 hover:decoration-sweater-1",
        className,
      )}
    >
      {children}
    </a>
  );
};

export { Link };
