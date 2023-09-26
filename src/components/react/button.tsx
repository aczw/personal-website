import { cn } from "@/utils/cn";

const Button = ({
  onClick,
  className,
  children,
}: {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center rounded-full bg-sweater-4 px-3 py-1 text-sweater-9 transition-colors hover:bg-sweater-3",
        className,
      )}
    >
      {children}
    </button>
  );
};

export { Button };
