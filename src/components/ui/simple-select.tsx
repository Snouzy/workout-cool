"use client";

import React from "react";

import { cn } from "@/shared/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

interface SimpleSelectProps<T extends string = string> {
  value: T;
  onValueChange: (value: T) => void;
  options: SelectOption<T>[];
  placeholder?: string;
  className?: string;
  // Additional props for better customization
  disabled?: boolean;
  "aria-label"?: string;
}

/**
 * A simple, reusable select component built on top of shadcn/ui Select
 *
 * @example
 * ```tsx
 * const options = [
 *   { value: "apple", label: "Apple" },
 *   { value: "banana", label: "Banana" }
 * ];
 *
 * <SimpleSelect
 *   value={selectedFruit}
 *   onValueChange={setSelectedFruit}
 *   options={options}
 *   placeholder="Select a fruit"
 * />
 * ```
 */
export function SimpleSelect<T extends string = string>({
  value,
  onValueChange,
  options,
  placeholder,
  className,
  disabled = false,
  "aria-label": ariaLabel,
}: SimpleSelectProps<T>) {
  return (
    <Select disabled={disabled} onValueChange={(newValue) => onValueChange(newValue as T)} value={value}>
      <SelectTrigger aria-label={ariaLabel} className={cn("w-full", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
