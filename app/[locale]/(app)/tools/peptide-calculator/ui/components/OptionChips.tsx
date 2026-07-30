"use client";

import { useState } from "react";

import { ChipLabel } from "./Chip";

interface OptionChipsProps {
  name: string;
  legend: string;
  options: number[];
  value: number;
  onChange: (value: number) => void;
  suffix: string;
  otherLabel: string;
}

export function OptionChips({ name, legend, options, value, onChange, suffix, otherLabel }: OptionChipsProps) {
  const [customMode, setCustomMode] = useState(!options.includes(value));
  const isCustom = customMode || !options.includes(value);

  return (
    <fieldset className="flex flex-wrap gap-2">
      <legend className="sr-only">{legend}</legend>

      {options.map((option) => (
        <ChipLabel key={option} selected={!isCustom && option === value}>
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
        </ChipLabel>
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
        <ChipLabel selected={false}>
          <input className="sr-only" name={name} onChange={() => setCustomMode(true)} type="radio" />
          {otherLabel}
        </ChipLabel>
      )}
    </fieldset>
  );
}
