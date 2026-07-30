"use client";

import { ChipLabel } from "./Chip";

export type CalculatorMode = "forward" | "reverse";

interface ModeSelectorProps {
  legend: string;
  value: CalculatorMode;
  onChange: (mode: CalculatorMode) => void;
  forwardLabel: string;
  reverseLabel: string;
}

export function ModeSelector({ legend, value, onChange, forwardLabel, reverseLabel }: ModeSelectorProps) {
  return (
    <fieldset className="mb-6 flex flex-wrap gap-2">
      <legend className="mb-2 text-xs font-bold uppercase tracking-widest text-base-content/50">{legend}</legend>

      {(["forward", "reverse"] as const).map((mode) => (
        <ChipLabel key={mode} selected={value === mode}>
          <input checked={value === mode} className="sr-only" name="mode" onChange={() => onChange(mode)} type="radio" />
          {mode === "forward" ? forwardLabel : reverseLabel}
        </ChipLabel>
      ))}
    </fieldset>
  );
}
