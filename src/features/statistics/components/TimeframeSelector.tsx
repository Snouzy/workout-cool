"use client";

import React from "react";

import { useI18n } from "locales/client";
import { StatisticsTimeframe } from "@/shared/types/statistics.types";
import { cn } from "@/shared/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TimeframeSelectorProps {
  selected: StatisticsTimeframe;
  onSelect: (timeframe: StatisticsTimeframe) => void;
  className?: string;
}

const TIMEFRAME_OPTIONS: { value: StatisticsTimeframe; label: string }[] = [
  { value: "4weeks", label: "4 Weeks" },
  { value: "8weeks", label: "8 Weeks" },
  { value: "12weeks", label: "12 Weeks" },
  { value: "1year", label: "1 Year" },
];

export function TimeframeSelector({ selected, onSelect, className }: TimeframeSelectorProps) {
  const t = useI18n();

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-sm font-medium text-gray-700">
        {t("statistics.timeframe")}:
      </span>
      <Select onValueChange={(value) => onSelect(value as StatisticsTimeframe)} value={selected}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {TIMEFRAME_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// Alternative segmented control style (similar to mobile)
export function TimeframeSelectorSegmented({ selected, onSelect, className }: TimeframeSelectorProps) {
  const t = useI18n();

  return (
    <div 
      aria-label={t("statistics.timeframe_selector")}
      className={cn("inline-flex rounded-lg bg-gray-100 p-1", className)}
      role="radiogroup"
    >
      {TIMEFRAME_OPTIONS.map((option) => (
        <button
          aria-checked={selected === option.value}
          aria-label={option.label}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-all",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            selected === option.value
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          )}
          key={option.value}
          onClick={() => onSelect(option.value)}
          role="radio"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}