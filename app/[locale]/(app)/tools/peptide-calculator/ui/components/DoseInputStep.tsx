import { Step } from "./Step";
import { OptionChips } from "./OptionChips";
import { CalculatorMode } from "./ModeSelector";

interface DoseInputStepLabels {
  forwardEyebrow: string;
  forwardTitle: string;
  reverseEyebrow: string;
  reverseTitle: string;
  other: string;
  units: string;
}

interface DoseInputStepProps {
  mode: CalculatorMode;
  doseMcg: number;
  onDoseChange: (doseMcg: number) => void;
  doseOptions: number[];
  units: number;
  onUnitsChange: (units: number) => void;
  unitsOptions: number[];
  labels: DoseInputStepLabels;
}

export function DoseInputStep({
  mode,
  doseMcg,
  onDoseChange,
  doseOptions,
  units,
  onUnitsChange,
  unitsOptions,
  labels,
}: DoseInputStepProps) {
  if (mode === "forward") {
    return (
      <Step eyebrow={labels.forwardEyebrow} number="04" title={labels.forwardTitle}>
        <OptionChips
          legend={labels.forwardTitle}
          name="dose"
          onChange={onDoseChange}
          options={doseOptions}
          otherLabel={labels.other}
          suffix="mcg"
          value={doseMcg}
        />
      </Step>
    );
  }

  return (
    <Step eyebrow={labels.reverseEyebrow} number="04" title={labels.reverseTitle}>
      <OptionChips
        legend={labels.reverseTitle}
        name="units"
        onChange={onUnitsChange}
        options={unitsOptions}
        otherLabel={labels.other}
        suffix={labels.units}
        value={units}
      />
    </Step>
  );
}
