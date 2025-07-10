import { Star } from "lucide-react";

import { cn } from "@/shared/lib/utils";

interface StarButtonProps {
  isActive: boolean;
  isLoading: boolean;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  children?: React.ReactNode;
}

export function StarButton({ isActive, isLoading, onClick, className, children }: StarButtonProps) {
  return (
    <button
      className={cn("transition-colors duration-200 text-yellow-500 btn btn-neutral btn-sm", className)}
      disabled={isLoading}
      onClick={onClick}
    >
      <Star className={cn("transition-all duration-200 h-5 w-5", isActive ? "fill-current" : "fill-none", isLoading && "animate-pulse")} />
      {children}
    </button>
  );
}
