"use client";

import { Share2, Check, Loader2 } from "lucide-react";

import { useProgramShare } from "../hooks/use-program-share";

interface ShareButtonProps {
  programTitle: string;
  programDescription?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "ghost";
}

/**
 * Reusable share button component
 * Shows appropriate feedback based on share status
 */
export function ShareButton({ 
  programTitle, 
  programDescription,
  className = "",
  size = "md",
  variant = "default"
}: ShareButtonProps) {
  const { handleShare, isSharing, shareMessage } = useProgramShare({
    programTitle,
    programDescription,
  });

  // Size classes
  const sizeClasses = {
    sm: "p-2",
    md: "p-3", 
    lg: "p-4",
  };

  // Variant classes
  const variantClasses = {
    default: "bg-[#4F8EF7] hover:bg-[#4F8EF7]/80 text-white",
    ghost: "bg-transparent hover:bg-white/10 text-current",
  };

  // Icon size based on button size
  const iconSize = {
    sm: 16,
    md: 18,
    lg: 20,
  }[size];

  return (
    <div className="relative">
      <button
        className={`
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          rounded-xl 
          transition-all 
          duration-200 
          ease-in-out 
          hover:scale-105
          disabled:opacity-50
          disabled:cursor-not-allowed
          disabled:hover:scale-100
          ${className}
        `}
        disabled={isSharing}
        onClick={handleShare}
        type="button"
      >
        {isSharing ? (
          <Loader2 className="animate-spin" size={iconSize} />
        ) : shareMessage ? (
          <Check size={iconSize} />
        ) : (
          <Share2 size={iconSize} />
        )}
      </button>

      {/* Feedback tooltip */}
      {shareMessage && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
          {shareMessage}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
        </div>
      )}
    </div>
  );
}