import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// copied straight from shadcn/ui... thanks shadcn
const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export { cn };
