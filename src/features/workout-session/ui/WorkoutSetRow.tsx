import { Plus, Minus } from "lucide-react";

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
  // On utilise un tableau de types pour gérer plusieurs colonnes
  const types = set.types || [set.type];
  const maxColumns = 4;

  // Handlers pour chaque champ
  const handleTypeChange = (columnIndex: number) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTypes = [...types];
    newTypes[columnIndex] = e.target.value as WorkoutSetType;
    onChange(setIndex, { types: newTypes });
  };

  const handleValueIntChange = (columnIndex: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValuesInt = Array.isArray(set.valuesInt) ? [...set.valuesInt] : [];
    newValuesInt[columnIndex] = e.target.value ? parseInt(e.target.value, 10) : 0;
    onChange(setIndex, { valuesInt: newValuesInt });
  };

  const handleValueSecChange = (columnIndex: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValuesSec = Array.isArray(set.valuesSec) ? [...set.valuesSec] : [];
    newValuesSec[columnIndex] = e.target.value ? parseInt(e.target.value, 10) : 0;
    onChange(setIndex, { valuesSec: newValuesSec });
  };

  const handleUnitChange = (columnIndex: number) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnits = Array.isArray(set.units) ? [...set.units] : [];
    newUnits[columnIndex] = e.target.value as WorkoutSetUnit;
    onChange(setIndex, { units: newUnits });
  };

  const addColumn = () => {
    if (types.length < maxColumns) {
      const newTypes = [...types, "REPS" as WorkoutSetType];
      onChange(setIndex, { types: newTypes });
    }
  };

  const removeColumn = (columnIndex: number) => {
    const newTypes = types.filter((_, idx) => idx !== columnIndex);
    const newValuesInt = Array.isArray(set.valuesInt) ? set.valuesInt.filter((_, idx) => idx !== columnIndex) : [];
    const newValuesSec = Array.isArray(set.valuesSec) ? set.valuesSec.filter((_, idx) => idx !== columnIndex) : [];
    const newUnits = Array.isArray(set.units) ? set.units.filter((_, idx) => idx !== columnIndex) : [];

    onChange(setIndex, {
      types: newTypes,
      valuesInt: newValuesInt,
      valuesSec: newValuesSec,
      units: newUnits,
    });
  };

  const renderInputForType = (type: WorkoutSetType, columnIndex: number) => {
    const valuesInt = Array.isArray(set.valuesInt) ? set.valuesInt : [set.valueInt];
    const valuesSec = Array.isArray(set.valuesSec) ? set.valuesSec : [set.valueSec];
    const units = Array.isArray(set.units) ? set.units : [set.unit];

    switch (type) {
      case "TIME":
        return (
          <div className="flex gap-1 w-full">
            <input
              className="border border-black rounded px-1 py-1 w-1/2 text-sm text-center font-bold"
              disabled={set.completed}
              min={0}
              onChange={handleValueIntChange(columnIndex)}
              placeholder="min"
              type="number"
              value={valuesInt[columnIndex] ?? ""}
            />
            <input
              className="border border-black rounded px-1 py-1 w-1/2 text-sm text-center font-bold"
              disabled={set.completed}
              max={59}
              min={0}
              onChange={handleValueSecChange(columnIndex)}
              placeholder="sec"
              type="number"
              value={valuesSec[columnIndex] ?? ""}
            />
          </div>
        );
      case "WEIGHT":
        return (
          <div className="flex gap-1 w-full items-center">
            <input
              className="border border-black rounded px-1 py-1 w-1/2 text-sm text-center font-bold"
              disabled={set.completed}
              min={0}
              onChange={handleValueIntChange(columnIndex)}
              placeholder=""
              type="number"
              value={valuesInt[columnIndex] ?? ""}
            />
            <select
              className="border border-black rounded px-1 py-1 w-1/2 text-sm font-bold bg-white"
              disabled={set.completed}
              onChange={handleUnitChange(columnIndex)}
              value={units[columnIndex] ?? "kg"}
            >
              <option value="kg">kg</option>
              <option value="lbs">lbs</option>
            </select>
          </div>
        );
      case "REPS":
        return (
          <input
            className="border border-black rounded px-1 py-1 w-full text-sm text-center font-bold"
            disabled={set.completed}
            min={0}
            onChange={handleValueIntChange(columnIndex)}
            placeholder=""
            type="number"
            value={valuesInt[columnIndex] ?? ""}
          />
        );
      case "BODYWEIGHT":
        return (
          <input
            className="border border-black rounded px-1 py-1 w-full text-sm text-center font-bold"
            disabled={set.completed}
            placeholder=""
            readOnly
            value="✔"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 w-full py-2">
      {/* Label SET X */}
      <div className="font-bold text-slate-700 min-w-[3rem] text-right">SET {setIndex + 1}</div>

      {/* Colonnes de types */}
      <div className="flex flex-1 gap-2 min-w-0">
        {types.map((type, columnIndex) => (
          <div className="flex flex-col min-w-0 flex-1" key={columnIndex}>
            <div className="flex items-center w-full gap-1 mb-1">
              <select
                className="border border-black rounded font-bold px-1 py-1 text-sm w-full bg-white min-w-0"
                disabled={set.completed}
                onChange={handleTypeChange(columnIndex)}
                value={type}
              >
                <option value="TIME">TEMPS</option>
                <option value="WEIGHT">POIDS</option>
                <option value="REPS">REPS</option>
                <option value="BODYWEIGHT">BODYWEIGHT</option>
              </select>
              {types.length > 1 && (
                <Button
                  className="p-1 h-auto bg-red-500 hover:bg-red-600 flex-shrink-0"
                  onClick={() => removeColumn(columnIndex)}
                  size="small"
                  variant="destructive"
                >
                  <Minus className="h-3 w-3" />
                </Button>
              )}
            </div>
            {renderInputForType(type, columnIndex)}
          </div>
        ))}

        {/* Bouton pour ajouter une colonne */}
        {types.length < maxColumns && (
          <Button
            className="self-start mt-1 p-1 h-auto bg-green-500 hover:bg-green-600 flex-shrink-0"
            onClick={addColumn}
            size="small"
            variant="default"
          >
            <Plus className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Finish button */}
      <Button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 text-sm rounded flex-shrink-0"
        disabled={set.completed}
        onClick={onFinish}
      >
        Finish
      </Button>
    </div>
  );
}
