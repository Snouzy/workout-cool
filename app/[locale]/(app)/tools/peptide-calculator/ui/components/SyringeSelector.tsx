"use client";

import Image from "next/image";

import { SyringeCapacity } from "../../lib/types";
import { SYRINGE_OPTIONS } from "../../lib/presets";
import { formatLocaleNumber } from "../../lib/formatNumber";

import type { Locale } from "locales/types";

interface SyringeSelectorProps {
  legend: string;
  value: SyringeCapacity;
  onChange: (value: SyringeCapacity) => void;
  unitsLabel: string;
  locale: Locale;
}

export function SyringeSelector({ legend, value, onChange, unitsLabel, locale }: SyringeSelectorProps) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="sr-only">{legend}</legend>

      {SYRINGE_OPTIONS.map((option, index) => (
        <label
          className={[
            "flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-4 transition-colors",
            "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2",
            option.capacity === value
              ? "border-primary bg-primary/5"
              : "border-base-content/15 bg-base-100 hover:border-primary/40",
          ].join(" ")}
          key={option.capacity}
        >
          <input
            checked={option.capacity === value}
            className="sr-only"
            name="syringe"
            onChange={() => onChange(option.capacity)}
            type="radio"
            value={option.capacity}
          />

          <div className="min-w-[4.5rem]">
            <div className="text-lg font-bold text-base-content">{formatLocaleNumber(option.volumeMl, 1, locale)} mL</div>
            <div className="text-sm text-base-content/60">
              {option.capacity} {unitsLabel}
            </div>
          </div>

          <Image
            alt=""
            className="h-auto w-full max-w-[13rem] object-contain"
            height={80}
            priority={index === 0}
            src={option.image}
            width={320}
          />
        </label>
      ))}
    </fieldset>
  );
}
