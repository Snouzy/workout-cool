import { WorkoutSet, WorkoutSetType, WorkoutSetUnit } from "@/features/workout-session/types/workout-set";
import { Button } from "@/components/ui/button";

interface WorkoutSetRowProps {
  set: WorkoutSet;
  setIndex: number;
  onChange: (setIndex: number, data: Partial<WorkoutSet>) => void;
  onFinish: () => void;
  onRemove: () => void;
}

const SET_TYPES: WorkoutSetType[] = ["REPS", "WEIGHT", "TIME", "BODYWEIGHT", "NA"];
const UNITS: WorkoutSetUnit[] = ["kg", "lbs"];

export function WorkoutSetRow({ set, setIndex, onChange, onFinish, onRemove }: WorkoutSetRowProps) {
  // Handlers pour chaque champ
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(setIndex, { type: e.target.value as WorkoutSetType });
  };
  const handleValueIntChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(setIndex, { valueInt: e.target.value ? parseInt(e.target.value, 10) : undefined });
  };
  const handleValueSecChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(setIndex, { valueSec: e.target.value ? parseInt(e.target.value, 10) : undefined });
  };
  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(setIndex, { unit: e.target.value as WorkoutSetUnit });
  };

  return (
    <div className="flex items-center gap-4 w-full py-2">
      {/* Label SET X */}
      <div className="w-16 text-right font-bold text-slate-700">SET {setIndex + 1}</div>

      {/* Type Selector */}
      <div className="flex flex-col items-center w-32">
        <select
          className="border border-black rounded font-bold px-2 py-1 text-lg w-full mb-1 bg-white"
          disabled={set.completed}
          onChange={handleTypeChange}
          value={set.type}
        >
          <option value="TIME">TEMPS</option>
          <option value="WEIGHT">POIDS</option>
          <option value="REPS">REPS</option>
          <option value="BODYWEIGHT">BODYWEIGHT</option>
        </select>

        {/* Input fields based on type */}
        {set.type === "TIME" && (
          <div className="flex gap-1 w-full">
            <input
              className="border border-black rounded px-1 py-1 w-1/2 text-lg text-center font-bold"
              disabled={set.completed}
              min={0}
              onChange={handleValueIntChange}
              placeholder="min"
              type="number"
              value={set.valueInt ?? ""}
            />
            <input
              className="border border-black rounded px-1 py-1 w-1/2 text-lg text-center font-bold"
              disabled={set.completed}
              max={59}
              min={0}
              onChange={handleValueSecChange}
              placeholder="sec"
              type="number"
              value={set.valueSec ?? ""}
            />
          </div>
        )}

        {set.type === "WEIGHT" && (
          <div className="flex gap-1 w-full items-center">
            <input
              className="border border-black rounded px-1 py-1 w-1/2 text-lg text-center font-bold"
              disabled={set.completed}
              min={0}
              onChange={handleValueIntChange}
              placeholder=""
              type="number"
              value={set.valueInt ?? ""}
            />
            <select
              className="border border-black rounded px-1 py-1 w-1/2 text-lg font-bold bg-white"
              disabled={set.completed}
              onChange={handleUnitChange}
              value={set.unit ?? "kg"}
            >
              <option value="kg">kg</option>
              <option value="lbs">lbs</option>
            </select>
          </div>
        )}

        {set.type === "REPS" && (
          <input
            className="border border-black rounded px-1 py-1 w-full text-lg text-center font-bold"
            disabled={set.completed}
            min={0}
            onChange={handleValueIntChange}
            placeholder=""
            type="number"
            value={set.valueInt ?? ""}
          />
        )}

        {set.type === "BODYWEIGHT" && (
          <input
            className="border border-black rounded px-1 py-1 w-full text-lg text-center font-bold"
            disabled={set.completed}
            placeholder=""
            readOnly
            value="✔"
          />
        )}
      </div>

      {/* Finish button */}
      <div className="flex items-center w-32 justify-end">
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 py-2 text-lg rounded"
          disabled={set.completed}
          onClick={onFinish}
          style={{ minWidth: 100 }}
        >
          Finish
        </Button>
      </div>
    </div>
  );
}
