"use client";

import { useEffect, useMemo, useState } from "react";
import { useCurrentLocale, useI18n } from "locales/client";

import { PeptideInput, SyringeCapacity } from "../lib/types";
import { DEFAULT_INPUT, DOSE_MCG_OPTIONS, PEPTIDE_PRESETS, UNITS_OPTIONS, VIAL_MG_OPTIONS, WATER_ML_OPTIONS } from "../lib/presets";
import { calculateDoseFromUnits, calculatePeptideDose } from "../lib/calculate";
import { SyringeSelector } from "./components/SyringeSelector";
import { Step } from "./components/Step";
import { PresetPicker } from "./components/PresetPicker";
import { OptionChips } from "./components/OptionChips";
import { ModeSelector, CalculatorMode } from "./components/ModeSelector";
import { DoseInputStep } from "./components/DoseInputStep";
import { CalculatorResult } from "./components/CalculatorResult";

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

interface PeptideCalculatorClientProps {
  defaultInput?: PeptideInput;
  disclaimer: string;
}

export function PeptideCalculatorClient({ defaultInput = DEFAULT_INPUT, disclaimer }: PeptideCalculatorClientProps) {
  const t = useI18n();
  const locale = useCurrentLocale();
  const [input, setInput] = useState<PeptideInput>(defaultInput);
  const [mode, setMode] = useState<CalculatorMode>("forward");
  const [units, setUnits] = useState(10);

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

  const result = useMemo(() => calculatePeptideDose(input), [input]);
  const reverseDose = useMemo(
    () => calculateDoseFromUnits({ vialMg: input.vialMg, waterMl: input.waterMl, units }),
    [input.vialMg, input.waterMl, units],
  );
  const patch = (partial: Partial<PeptideInput>) => setInput((current) => ({ ...current, ...partial }));

  const optionSteps = [
    { number: "02", eyebrow: t("tools.peptide-calculator.step_2_eyebrow"), title: t("tools.peptide-calculator.step_2_title"), name: "vial", options: VIAL_MG_OPTIONS, suffix: "mg", value: input.vialMg, onChange: (vialMg: number) => patch({ vialMg }) },
    { number: "03", eyebrow: t("tools.peptide-calculator.step_3_eyebrow"), title: t("tools.peptide-calculator.step_3_title"), name: "water", options: WATER_ML_OPTIONS, suffix: "mL", value: input.waterMl, onChange: (waterMl: number) => patch({ waterMl }) },
  ];

  return (
    <div>
      <ModeSelector
        forwardLabel={t("tools.peptide-calculator.mode_forward")}
        legend={t("tools.peptide-calculator.mode_legend")}
        onChange={setMode}
        reverseLabel={t("tools.peptide-calculator.mode_reverse")}
        value={mode}
      />

      <PresetPicker
        legend={t("tools.peptide-calculator.presets_legend")}
        onSelect={(vialMg) => patch({ vialMg })}
        presets={PEPTIDE_PRESETS}
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <Step eyebrow={t("tools.peptide-calculator.step_1_eyebrow")} number="01" title={t("tools.peptide-calculator.step_1_title")}>
          <SyringeSelector
            legend={t("tools.peptide-calculator.step_1_title")}
            locale={locale}
            onChange={(syringeCapacity) => patch({ syringeCapacity })}
            unitsLabel={t("tools.peptide-calculator.units")}
            value={input.syringeCapacity}
          />
        </Step>

        <div className="flex flex-col gap-8">
          {optionSteps.map((step) => (
            <Step eyebrow={step.eyebrow} key={step.number} number={step.number} title={step.title}>
              <OptionChips legend={step.title} name={step.name} onChange={step.onChange} options={step.options} otherLabel={t("tools.peptide-calculator.other")} suffix={step.suffix} value={step.value} />
            </Step>
          ))}

          <DoseInputStep
            doseMcg={input.doseMcg}
            doseOptions={DOSE_MCG_OPTIONS}
            labels={{
              forwardEyebrow: t("tools.peptide-calculator.step_4_eyebrow"),
              forwardTitle: t("tools.peptide-calculator.step_4_title"),
              reverseEyebrow: t("tools.peptide-calculator.step_4_reverse_eyebrow"),
              reverseTitle: t("tools.peptide-calculator.step_4_reverse_title"),
              other: t("tools.peptide-calculator.other"),
              units: t("tools.peptide-calculator.units"),
            }}
            mode={mode}
            onDoseChange={(doseMcg) => patch({ doseMcg })}
            onUnitsChange={setUnits}
            units={units}
            unitsOptions={UNITS_OPTIONS}
          />
        </div>
      </div>

      <CalculatorResult
        capacity={input.syringeCapacity}
        concentrationMgPerMl={input.vialMg / input.waterMl}
        doseMcg={input.doseMcg}
        forwardLabels={{
          eyebrow: t("tools.peptide-calculator.result.eyebrow"),
          drawTo: t("tools.peptide-calculator.result.draw_to"),
          units: t("tools.peptide-calculator.units"),
          concentration: t("tools.peptide-calculator.result.concentration"),
          dosesPerVial: t("tools.peptide-calculator.result.doses_per_vial"),
          invalid: t("tools.peptide-calculator.result.invalid"),
          warnings: {
            EXCEEDS_SYRINGE: t("tools.peptide-calculator.warnings.exceeds_syringe"),
            TOO_SMALL_TO_MEASURE: t("tools.peptide-calculator.warnings.too_small"),
            WATER_EXCEEDS_VIAL: t("tools.peptide-calculator.warnings.water_excess"),
            NOT_A_WHOLE_GRADUATION: t("tools.peptide-calculator.warnings.not_whole_graduation"),
          },
        }}
        locale={locale}
        mode={mode}
        result={result}
        reverseDoseMcg={reverseDose}
        reverseLabels={{
          eyebrow: t("tools.peptide-calculator.result.eyebrow"),
          doseIs: t("tools.peptide-calculator.result.dose_is"),
          units: t("tools.peptide-calculator.units"),
          concentration: t("tools.peptide-calculator.result.concentration"),
          invalid: t("tools.peptide-calculator.result.invalid"),
        }}
        units={units}
      />

      <p className="mt-6 rounded-2xl bg-base-200 p-5 text-sm text-base-content/70">{disclaimer}</p>
    </div>
  );
}
