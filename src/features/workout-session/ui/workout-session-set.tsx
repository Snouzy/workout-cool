import { Plus, Minus, Trash2 } from "lucide-react";

import { useI18n } from "locales/client";
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

export function WorkoutSessionSet({ set, setIndex, onChange, onFinish, onRemove }: WorkoutSetRowProps) {
  const t = useI18n();
  // On utilise un tableau de types pour gérer plusieurs colonnes
  const types = set.types || [];
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

  const handleEdit = () => {
    onChange(setIndex, { completed: false });
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
    <div className="w-full py-4 flex flex-col gap-2 bg-slate-50 border border-slate-200 rounded-xl shadow-sm mb-3 relative px-2 sm:px-4">
      <div className="flex items-center justify-between mb-2">
        <div className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">SET {setIndex + 1}</div>
        <Button
          aria-label="Supprimer la série"
          className="bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-1 h-8 w-8 flex items-center justify-center shadow transition"
          disabled={set.completed}
          onClick={onRemove}
          type="button"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Colonnes de types, stack vertical on mobile, horizontal on md+ */}
      <div className="flex flex-col md:flex-row gap-2 w-full">
        {types.map((type, columnIndex) => (
          <div className="flex flex-col w-full md:w-auto" key={columnIndex}>
            <div className="flex items-center w-full gap-1 mb-1">
              <select
                className="border border-black rounded font-bold px-1 py-1 text-sm w-full bg-white min-w-0"
                disabled={set.completed}
                onChange={handleTypeChange(columnIndex)}
                value={type}
              >
                <option value="TIME">{t("workout_builder.session.time")}</option>
                <option value="WEIGHT">{t("workout_builder.session.weight")}</option>
                <option value="REPS">{t("workout_builder.session.reps")}</option>
                <option value="BODYWEIGHT">{t("workout_builder.session.bodyweight")}</option>
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
      </div>

      {/* Bouton pour ajouter une colonne, sous les colonnes */}
      {types.length < maxColumns && (
        <div className="flex w-full justify-start mt-1">
          <Button
            className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 text-sm rounded w-full md:w-auto mt-2"
            disabled={set.completed}
            onClick={addColumn}
          >
            <Plus className="h-4 w-4" />
            {t("workout_builder.session.add_column")}
          </Button>
        </div>
      )}

      {/* Finish & Edit buttons, full width on mobile */}
      <div className="flex gap-2 w-full md:w-auto mt-2">
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 text-sm rounded flex-1"
          disabled={set.completed}
          onClick={onFinish}
        >
          {t("workout_builder.session.finish_set")}
        </Button>
        {set.completed && (
          <Button
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2 text-sm rounded flex-1 border border-gray-300"
            onClick={handleEdit}
            variant="outline"
          >
            {t("commons.edit")}
          </Button>
        )}
      </div>
    </div>
  );
}
