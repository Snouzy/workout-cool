import { Star } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "./button";

interface StarButtonProps {
  isFavorited: boolean;
  isLoading: boolean;
  onToggle: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function StarButton({ isFavorited, isLoading, onToggle, className, size = "md" }: StarButtonProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      disabled={isLoading}
      className={cn(
        sizeClasses[size],
        "hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors duration-200",
        isFavorited && "text-yellow-500 hover:text-yellow-600",
        !isFavorited && "text-gray-400 hover:text-yellow-500",
        className,
      )}
    >
      <Star
        className={cn(
          iconSizes[size],
          "transition-all duration-200",
          isFavorited ? "fill-current" : "fill-none",
          isLoading && "animate-pulse",
        )}
      />
    </Button>
  );
}