import { Star } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "./button";

interface StarButtonProps {
  isActive: boolean;
  isLoading: boolean;
  onClick?: () => void;
  className?: string;
}

export function StarButton({ isActive, isLoading, onClick, className }: StarButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      disabled={isLoading}
      onClick={onClick}
      className={cn(
        "hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors duration-200 h-4 w-4",
        isActive && "text-yellow-500 hover:text-yellow-600",
        !isActive && "text-gray-400 hover:text-yellow-500",
        className,
      )}
    >
      <Star className={cn("transition-all duration-200 h-4 w-4", isActive ? "fill-current" : "fill-none", isLoading && "animate-pulse")} />
    </Button>
  );
}

