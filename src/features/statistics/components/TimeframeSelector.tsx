"use client";

import React from "react";

import { useI18n } from "locales/client";
import { cn } from "@/shared/lib/utils";
import { StatisticsTimeframe } from "@/shared/constants/statistics";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TimeframeSelectorProps {
  selected: StatisticsTimeframe;
  onSelect: (timeframe: StatisticsTimeframe) => void;
  className?: string;
}

const TIMEFRAME_OPTIONS = [
  { value: "4weeks" as StatisticsTimeframe, labelKey: "statistics.timeframes.4weeks" },
  { value: "8weeks" as StatisticsTimeframe, labelKey: "statistics.timeframes.8weeks" },
  { value: "12weeks" as StatisticsTimeframe, labelKey: "statistics.timeframes.12weeks" },
  { value: "1year" as StatisticsTimeframe, labelKey: "statistics.timeframes.1year" },
];

export function TimeframeSelector({ selected, onSelect, className }: TimeframeSelectorProps) {
  const t = useI18n();

  return (
    <Select onValueChange={(value) => onSelect(value as StatisticsTimeframe)} value={selected}>
      <SelectTrigger className={cn("w-32", className)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {TIMEFRAME_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {t(option.labelKey as keyof typeof t)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
