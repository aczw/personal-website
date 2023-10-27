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
        "bg-sweater-4 text-sweater-9 hover:bg-sweater-3 flex items-center rounded-full px-3 py-1 transition-colors",
        className,
      )}
    >
      {children}
    </button>
  );
};

export { Button };
