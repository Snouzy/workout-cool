"use client";

import React from "react";
import { InfoIcon } from "lucide-react";

import { useIsMobile } from "@/shared/hooks/useIsMobile";

interface InfoButtonProps {
  onClick: () => void;
  tooltip?: React.ReactNode;
}

export function InfoButton({ onClick, tooltip }: InfoButtonProps) {
  const isMobile = useIsMobile();

  return (
    <div className="relative">
      <button aria-label="More information" className="touch-manipulation p-1 -m-1" onClick={onClick}>
        <InfoIcon
          className={`w-4 h-4 cursor-help transition-colors ${
            isMobile ? "text-primary animate-pulse" : "text-base-content/40 hover:text-primary"
          }`}
        />
      </button>
      {!isMobile && tooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-base-100 dark:bg-base-200 rounded-lg shadow-lg border border-base-content/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10 pointer-events-none">
          {tooltip}
        </div>
      )}
    </div>
  );
}
