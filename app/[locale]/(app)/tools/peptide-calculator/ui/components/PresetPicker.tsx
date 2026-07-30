"use client";

import { useId } from "react";

import { PeptidePreset } from "../../lib/presets";
import { ChipButton } from "./Chip";

interface PresetPickerProps {
  legend: string;
  presets: PeptidePreset[];
  onSelect: (vialMg: number) => void;
}

export function PresetPicker({ legend, presets, onSelect }: PresetPickerProps) {
  const legendId = useId();

  return (
    // The heading is no longer shown, but a row of bare buttons still needs a
    // name: the legend stays in the DOM as the group's accessible name.
    <div aria-labelledby={legendId} className="mb-8 flex flex-wrap gap-2" role="group">
      <p className="sr-only" id={legendId}>
        {legend}
      </p>

      {presets.map((preset) => (
        <ChipButton key={preset.id} onClick={() => onSelect(preset.vialSizesMg[0])}>
          {preset.label}
        </ChipButton>
      ))}
    </div>
  );
}
