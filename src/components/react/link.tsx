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
        "text-sweater-3 decoration-sweater-3/50 hover:text-sweater-1 hover:decoration-sweater-1 w-fit underline decoration-1 underline-offset-2 transition",
        className,
      )}
    >
      {children}
    </a>
  );
};

export { Link };
