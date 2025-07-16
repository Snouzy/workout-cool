import React from "react";

import { cn } from "@/shared/lib/utils";

export interface ChangelogNotificationBadgeProps {
  /** ARIA label for accessibility */
  ariaLabel?: string;
  /** Custom CSS classes */
  className?: string;
  /** Whether to show the badge */
  show: boolean;
  /** Custom size (small, medium, large) */
  size?: "small" | "medium" | "large";
  /** Custom color variant */
  variant?: "primary" | "secondary" | "success" | "warning" | "error";
}

const sizeClasses = {
  small: "w-2 h-2 sm:w-3 sm:h-3",
  medium: "w-3 h-3",
  large: "w-4 h-4",
};

const variantClasses = {
  primary: "bg-blue-500 dark:bg-blue-400",
  secondary: "bg-gray-500 dark:bg-gray-400",
  success: "bg-green-500 dark:bg-green-400",
  warning: "bg-yellow-500 dark:bg-yellow-400",
  error: "bg-red-500 dark:bg-red-400",
};

export function ChangelogNotificationBadge({
  ariaLabel = "New updates available",
  className,
  show,
  size = "medium",
  variant = "primary",
}: ChangelogNotificationBadgeProps) {
  if (!show) {
    return null;
  }

  return (
    <div
      aria-label={ariaLabel}
      aria-live="polite"
      className={cn(
        "absolute top-0.5 right-1 rounded-full transition-all duration-200 ease-in-out",
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
      role="status"
    >
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
}
