"use client";

import { cn } from "@/shared/lib/utils";
import { StarButton } from "@/components/ui/star-button";

interface FavoriteButtonProps {
  exerciseId: string;
  isFavorite: boolean;
  onToggle: (exerciseId: string) => void;
  className?: string;
}

export const FavoriteButton = ({ exerciseId, isFavorite, onToggle, className = "" }: FavoriteButtonProps) => {
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      onToggle(exerciseId);
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  return (
    <StarButton className={cn(className, "btn-sm btn-link")} isActive={isFavorite} isLoading={false} onClick={handleToggle}></StarButton>
  );
};
