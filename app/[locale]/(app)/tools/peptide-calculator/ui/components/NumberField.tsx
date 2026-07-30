"use client";

import { useEffect, useState } from "react";

import { MONO, MUTED } from "../../lib/classes";

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  /** Trailing unit, shown next to the field rather than inside it. */
  unit: string;
  step: number;
  /** Same quantity in the other unit, e.g. `= 8 mg`. */
  conversion?: string;
  autoFocus?: boolean;
}

/**
 * The free-entry field behind every "Other…" chip.
 *
 * It keeps its own text draft rather than rendering `String(value)`: a controlled number
 * input would erase the half-typed `0.` the moment it fails to parse. The draft is only
 * re-synced when the value changes from the outside — a preset chip, a unit switch.
 */
export function NumberField({ label, value, onChange, unit, step, conversion, autoFocus }: NumberFieldProps) {
  const [draft, setDraft] = useState(() => String(value));

  useEffect(() => {
    setDraft((current) => (Number(current) === value ? current : String(value)));
  }, [value]);

  return (
    <div className="col-span-full mt-0.5 flex min-w-0 items-center gap-2">
      <input
        aria-label={label}
        autoFocus={autoFocus}
        className="min-w-0 flex-1 rounded-lg border border-slate-400 bg-base-100 px-3 py-[11px] text-sm font-semibold text-base-content shadow-3xl outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20 dark:border-slate-600"
        min={0}
        onChange={(event) => {
          setDraft(event.target.value);

          const parsed = Number(event.target.value);
          if (Number.isFinite(parsed)) onChange(Math.max(0, parsed));
        }}
        step={step}
        type="number"
        value={draft}
      />
      <span className={`flex-none text-xs font-semibold ${MUTED}`}>{unit}</span>
      {conversion && <span className={`flex-none text-[11px] font-medium ${MONO} ${MUTED}`}>{conversion}</span>}
    </div>
  );
}
