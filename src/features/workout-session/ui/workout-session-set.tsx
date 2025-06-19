import { Plus, Minus, Trash2 } from "lucide-react";

import { useI18n } from "locales/client";
import { AVAILABLE_WORKOUT_SET_TYPES, MAX_WORKOUT_SET_COLUMNS } from "@/shared/constants/workout-set-types";
import { WorkoutSet, WorkoutSetType, WorkoutSetUnit } from "@/features/workout-session/types/workout-set";
import { getWorkoutSetTypeLabels } from "@/features/workout-session/lib/workout-set-labels";
import { Button } from "@/components/ui/button";

interface WorkoutSetRowProps {
  set: WorkoutSet;
  setIndex: number;
  onChange: (setIndex: number, data: Partial<WorkoutSet>) => void;
  onFinish: () => void;
  onRemove: () => void;
}

export function WorkoutSessionSet({ set, setIndex, onChange, onFinish, onRemove }: WorkoutSetRowProps) {
  const t = useI18n();
  const types = set.types || [];
  const typeLabels = getWorkoutSetTypeLabels(t);

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
    if (types.length < MAX_WORKOUT_SET_COLUMNS) {
      const firstAvailableType = AVAILABLE_WORKOUT_SET_TYPES.find((t) => !types.includes(t));
      if (firstAvailableType) {
        const newTypes = [...types, firstAvailableType];
        onChange(setIndex, { types: newTypes });
      }
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
    const valuesInt = set.valuesInt || [];
    const valuesSec = set.valuesSec || [];
    const units = set.units || [];

    switch (type) {
      case "TIME":
        return (
          <div className="flex gap-1 w-full">
            <input
              className="border border-black rounded px-1 py-2 w-1/2 text-base text-center font-bold dark:bg-slate-800 dark:placeholder:text-slate-500"
              disabled={set.completed}
              min={0}
              onChange={handleValueIntChange(columnIndex)}
              pattern="[0-9]*"
              placeholder="min"
              type="number"
              value={valuesInt[columnIndex] ?? ""}
            />
            <input
              className="border border-black rounded px-1 py-2 w-1/2 text-base text-center font-bold dark:bg-slate-800 dark:placeholder:text-slate-500"
              disabled={set.completed}
              max={59}
              min={0}
              onChange={handleValueSecChange(columnIndex)}
              pattern="[0-9]*"
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
              className="border border-black rounded px-1 py-2 w-1/2 text-base text-center font-bold dark:bg-slate-800"
              disabled={set.completed}
              min={0}
              onChange={handleValueIntChange(columnIndex)}
              pattern="[0-9]*"
              placeholder=""
              type="number"
              value={valuesInt[columnIndex] ?? ""}
            />
            <select
              className="border border-black rounded px-1 py-2 w-1/2 text-base font-bold bg-white dark:bg-slate-800 dark:text-gray-200 h-10 "
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
            className="border border-black rounded px-1 py-2 w-full text-base text-center font-bold dark:bg-slate-800"
            disabled={set.completed}
            min={0}
            onChange={handleValueIntChange(columnIndex)}
            pattern="[0-9]*"
            placeholder=""
            type="number"
            value={valuesInt[columnIndex] ?? ""}
          />
        );
      case "BODYWEIGHT":
        return (
          <input
            className="border border-black rounded px-1 py-2 w-full text-base text-center font-bold dark:bg-slate-800"
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
    <div className="w-full py-4 flex flex-col gap-2 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/50 rounded-xl shadow-sm mb-3 relative px-2 sm:px-4">
      <div className="flex items-center justify-between mb-2">
        <div className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow dark:bg-blue-900 dark:text-blue-300">
          SET {setIndex + 1}
        </div>
        <Button
          aria-label="Supprimer la série"
          className="bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/60 text-red-600 dark:text-red-300 rounded-full p-1 h-8 w-8 flex items-center justify-center shadow transition"
          disabled={set.completed}
          onClick={onRemove}
          type="button"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Columns of types, stack vertical on mobile, horizontal on md+ */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-2 w-full">
        {types.map((type, columnIndex) => {
          // An option is available if it's not used by another column, OR it's the current column's type.
          const availableTypes = AVAILABLE_WORKOUT_SET_TYPES.filter((option) => !types.includes(option) || option === type);

          return (
            <div className="flex flex-col w-full md:w-auto" key={columnIndex}>
              <div className="flex items-center w-full gap-1 mb-1">
                <select
                  className="border border-black dark:border-slate-700 rounded font-bold px-1 py-2 text-base w-full bg-white dark:bg-slate-800 dark:text-gray-200 min-w-0 h-10 "
                  disabled={set.completed}
                  onChange={handleTypeChange(columnIndex)}
                  value={type}
                >
                  {availableTypes.map((availableType) => (
                    <option key={availableType} value={availableType}>
                      {typeLabels[availableType]}
                    </option>
                  ))}
                </select>
                {types.length > 1 && (
                  <Button
                    className="p-1 h-auto bg-red-500 hover:bg-red-600 dark:bg-red-900 dark:hover:bg-red-800 flex-shrink-0"
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
          );
        })}
      </div>

      {/* Add column button */}
      {types.length < MAX_WORKOUT_SET_COLUMNS && !set.completed && (
        <div className="flex w-full justify-start mt-1">
          <Button
            className="font-bold px-4 py-2 text-sm rounded-xl w-full md:w-auto mt-2"
            disabled={set.completed}
            onClick={addColumn}
            variant="outline"
          >
            <Plus className="h-4 w-4" />
            <span className="block md:hidden">{t("workout_builder.session.add_row")}</span>
            <span className="hidden md:block">{t("workout_builder.session.add_column")}</span>
          </Button>
        </div>
      )}

      {/* Finish & Edit buttons, full width on mobile */}
      <div className="flex gap-2 w-full md:w-auto mt-2">
        <Button
          className=" dark:text-white font-bold px-4 py-2 text-sm rounded-xl flex-1"
          disabled={set.completed}
          onClick={onFinish}
          variant="default"
        >
          {t("workout_builder.session.finish_set")}
        </Button>
        {set.completed && (
          <Button
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2 text-sm rounded-xl flex-1 border border-gray-300"
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
