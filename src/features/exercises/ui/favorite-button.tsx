"use client";

import { Heart } from "lucide-react";

interface FavoriteButtonProps {
  exerciseId: string;
  isFavorite: boolean;
  onToggle: (exerciseId: string) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const FavoriteButton = ({
  exerciseId,
  isFavorite,
  onToggle,
  size = "md",
  className = "",
}: FavoriteButtonProps) => {
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      onToggle(exerciseId);
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const buttonSizeClasses = {
    sm: "p-1",
    md: "p-1.5",
    lg: "p-2",
  };

  return (
    <button
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      className={`${buttonSizeClasses[size]} hover:scale-110 transition-all duration-200 ${className}`}
      onClick={handleToggle}
    >
      <Heart
        className={`${sizeClasses[size]} transition-all duration-200 ${
          isFavorite
            ? "fill-yellow-400 text-yellow-400 scale-110"
            : "text-gray-400 hover:text-yellow-400"
        }`}
      />
    </button>
  );
};