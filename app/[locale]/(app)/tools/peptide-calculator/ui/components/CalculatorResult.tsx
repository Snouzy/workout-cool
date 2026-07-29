import { PeptideResult } from "../../lib/types";
import { ReverseResultCard, ReverseResultLabels } from "./ReverseResultCard";
import { ResultCard, ResultLabels } from "./ResultCard";
import { CalculatorMode } from "./ModeSelector";

interface CalculatorResultProps {
  mode: CalculatorMode;
  capacity: number;
  doseMcg: number;
  result: PeptideResult | null;
  forwardLabels: ResultLabels;
  reverseDoseMcg: number | null;
  concentrationMgPerMl: number;
  units: number;
  reverseLabels: ReverseResultLabels;
}

export function CalculatorResult({
  mode,
  capacity,
  doseMcg,
  result,
  forwardLabels,
  reverseDoseMcg,
  concentrationMgPerMl,
  units,
  reverseLabels,
}: CalculatorResultProps) {
  if (mode === "forward") {
    return <ResultCard capacity={capacity} doseMcg={doseMcg} labels={forwardLabels} result={result} />;
  }

  return (
    <ReverseResultCard
      concentrationMgPerMl={concentrationMgPerMl}
      doseMcg={reverseDoseMcg}
      labels={reverseLabels}
      units={units}
    />
  );
}
