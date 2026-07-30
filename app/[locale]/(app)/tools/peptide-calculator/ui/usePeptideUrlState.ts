"use client";

import { useEffect, useState } from "react";

import { PeptideInput, SyringeCapacity } from "../lib/types";

function readFromUrl(fallback: PeptideInput): PeptideInput {
  if (typeof window === "undefined") return fallback;

  const params = new URLSearchParams(window.location.search);
  const read = (key: string, value: number) => {
    const parsed = Number(params.get(key));
    return Number.isFinite(parsed) && parsed > 0 ? parsed : value;
  };
  const syringe = read("syringe", fallback.syringeCapacity);

  return {
    vialMg: read("vial", fallback.vialMg),
    waterMl: read("water", fallback.waterMl),
    doseMcg: read("dose", fallback.doseMcg),
    syringeCapacity: ([30, 50, 100] as const).includes(syringe as SyringeCapacity)
      ? (syringe as SyringeCapacity)
      : fallback.syringeCapacity,
  };
}

/** Holds the calculator input, hydrating it from the query string and mirroring it back. */
export function usePeptideUrlState(defaultInput: PeptideInput) {
  const [input, setInput] = useState<PeptideInput>(defaultInput);

  useEffect(() => {
    setInput(readFromUrl(defaultInput));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("vial", String(input.vialMg));
    params.set("water", String(input.waterMl));
    params.set("dose", String(input.doseMcg));
    params.set("syringe", String(input.syringeCapacity));

    window.history.replaceState(null, "", `${window.location.pathname}?${params}`);
  }, [input]);

  const patch = (partial: Partial<PeptideInput>) => setInput((current) => ({ ...current, ...partial }));

  return { input, patch };
}
