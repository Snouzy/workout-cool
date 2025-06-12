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
    <div className="flex flex-col md:flex-row items-center gap-4 w-full">
      {/* Sélecteur de type */}
      <select className="border rounded px-2 py-1 text-sm" disabled={set.completed} onChange={handleTypeChange} value={set.type}>
        {SET_TYPES.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      {/* Champs dynamiques selon le type */}
      {set.type === "REPS" && (
        <input
          className="border rounded px-2 py-1 w-20 text-sm"
          disabled={set.completed}
          min={0}
          onChange={handleValueIntChange}
          placeholder="Reps"
          type="number"
          value={set.valueInt ?? ""}
        />
      )}
      {set.type === "WEIGHT" && (
        <>
          <input
            className="border rounded px-2 py-1 w-20 text-sm"
            disabled={set.completed}
            min={0}
            onChange={handleValueIntChange}
            placeholder="Weight"
            type="number"
            value={set.valueInt ?? ""}
          />
          <select
            className="border rounded px-2 py-1 text-sm"
            disabled={set.completed}
            onChange={handleUnitChange}
            value={set.unit ?? "kg"}
          >
            {UNITS.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </>
      )}
      {set.type === "TIME" && (
        <div className="flex items-center gap-2">
          <input
            className="border rounded px-2 py-1 w-16 text-sm"
            disabled={set.completed}
            min={0}
            onChange={handleValueIntChange}
            placeholder="min"
            type="number"
            value={set.valueInt ?? ""}
          />
          <span>min</span>
          <input
            className="border rounded px-2 py-1 w-16 text-sm"
            disabled={set.completed}
            max={59}
            min={0}
            onChange={handleValueSecChange}
            placeholder="sec"
            type="number"
            value={set.valueSec ?? ""}
          />
          <span>sec</span>
        </div>
      )}
      {set.type === "BODYWEIGHT" && <span className="px-2 py-1 rounded bg-slate-200 text-slate-700 text-xs">Bodyweight</span>}
      {set.type === "NA" && <span className="px-2 py-1 rounded bg-slate-100 text-slate-400 text-xs">N/A</span>}

      {/* Actions */}
      <Button className="bg-blue-600 text-white" disabled={set.completed} onClick={onFinish}>
        {set.completed ? "Done" : "Finish"}
      </Button>
      <Button className="text-red-500 border-red-300 ml-2" onClick={onRemove} variant="outline">
        Remove
      </Button>
    </div>
  );
}
