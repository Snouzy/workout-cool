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
        "transition-colors duration-200 h-6 w-6 !text-yellow-500 hover:!text-yellow-600",
        className,
      )}
    >
      <Star className={cn(
        "transition-all duration-200 h-5 w-5",
        isActive ? "fill-current" : "fill-none",
        isLoading && "animate-pulse"
      )} />
    </Button>
  );
}
