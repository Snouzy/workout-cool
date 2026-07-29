"use client";

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
        <label
          className={[
            "cursor-pointer rounded-xl border-2 px-4 py-2 text-sm font-semibold transition-colors",
            "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2",
            value === mode
              ? "border-primary bg-primary/10 text-primary"
              : "border-base-content/15 bg-base-100 text-base-content/70 hover:border-primary/40",
          ].join(" ")}
          key={mode}
        >
          <input checked={value === mode} className="sr-only" name="mode" onChange={() => onChange(mode)} type="radio" />
          {mode === "forward" ? forwardLabel : reverseLabel}
        </label>
      ))}
    </fieldset>
  );
}
