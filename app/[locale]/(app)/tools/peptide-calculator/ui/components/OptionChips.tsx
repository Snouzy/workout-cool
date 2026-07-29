"use client";

import { useState } from "react";

interface OptionChipsProps {
  name: string;
  legend: string;
  options: number[];
  value: number;
  onChange: (value: number) => void;
  suffix: string;
  otherLabel: string;
}

function chipClassName(selected: boolean): string {
  return [
    "cursor-pointer rounded-xl border-2 px-4 py-2 text-sm font-semibold transition-colors",
    "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2",
    selected
      ? "border-primary bg-primary/10 text-primary"
      : "border-base-content/15 bg-base-100 text-base-content/70 hover:border-primary/40",
  ].join(" ");
}

export function OptionChips({ name, legend, options, value, onChange, suffix, otherLabel }: OptionChipsProps) {
  const [customMode, setCustomMode] = useState(!options.includes(value));
  const isCustom = customMode || !options.includes(value);

  return (
    <fieldset className="flex flex-wrap gap-2">
      <legend className="sr-only">{legend}</legend>

      {options.map((option) => (
        <label className={chipClassName(!isCustom && option === value)} key={option}>
          <input
            checked={!isCustom && option === value}
            className="sr-only"
            name={name}
            onChange={() => {
              setCustomMode(false);
              onChange(option);
            }}
            type="radio"
            value={option}
          />
          {option} {suffix}
        </label>
      ))}

      {isCustom ? (
        <input
          aria-label={otherLabel}
          className="input input-bordered w-28 rounded-xl"
          min={0}
          onChange={(event) => onChange(Number(event.target.value))}
          step="any"
          type="number"
          value={value}
        />
      ) : (
        <label className={chipClassName(false)}>
          <input className="sr-only" name={name} onChange={() => setCustomMode(true)} type="radio" />
          {otherLabel}
        </label>
      )}
    </fieldset>
  );
}
