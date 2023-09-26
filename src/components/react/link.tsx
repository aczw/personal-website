const Link = ({
  href,
  newTab = false,
  children,
}: {
  href: string;
  newTab?: boolean;
  children: React.ReactNode;
}) => {
  return (
    <a
      href={href}
      target={newTab ? "_blank" : "_self"}
      className="w-fit text-sweater-3 underline decoration-sweater-3/50 underline-offset-2 transition-colors hover:text-sweater-1 hover:decoration-sweater-3"
    >
      {children}
    </a>
  );
};

export { Link };
