"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { ProgramSessionExercise, ProgramSuggestedSet } from "@prisma/client";

import { AVAILABLE_WORKOUT_SET_TYPES, MAX_WORKOUT_SET_COLUMNS, WORKOUT_SET_UNITS_TUPLE } from "@/shared/constants/workout-set-types";
import { WorkoutSetType, WorkoutSetUnit } from "@/features/workout-session/types/workout-set";

import { updateExerciseSets } from "../actions/update-exercise-sets.action";

interface EditSetsModalProps {
  exercise: ProgramSessionExercise & {
    exercise: { name: string };
    suggestedSets: ProgramSuggestedSet[];
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SetData {
  id?: string;
  setIndex: number;
  types: WorkoutSetType[];
  valuesInt: number[];
  valuesSec: number[];
  units: WorkoutSetUnit[];
}

export function EditSetsModal({ exercise, open, onOpenChange }: EditSetsModalProps) {
  const router = useRouter();
  const [sets, setSets] = useState<SetData[]>(() =>
    exercise.suggestedSets.length > 0
      ? exercise.suggestedSets.map((set) => ({
          id: set.id,
          setIndex: set.setIndex,
          types: set.types as WorkoutSetType[],
          valuesInt: set.valuesInt,
          valuesSec: set.valuesSec,
          units: set.units as WorkoutSetUnit[],
        }))
      : [
          {
            setIndex: 0,
            types: ["WEIGHT", "REPS"] as WorkoutSetType[],
            valuesInt: [20, 10],
            valuesSec: [],
            units: ["kg"] as WorkoutSetUnit[],
          },
        ]
  );

  const addSet = () => {
    const newSet: SetData = {
      setIndex: sets.length,
      types: ["WEIGHT", "REPS"] as WorkoutSetType[],
      valuesInt: [20, 10],
      valuesSec: [],
      units: ["kg"] as WorkoutSetUnit[],
    };
    setSets([...sets, newSet]);
  };

  const removeSet = (index: number) => {
    setSets(sets.filter((_, i) => i !== index).map((set, i) => ({ ...set, setIndex: i })));
  };

  const updateSet = (setIndex: number, data: Partial<SetData>) => {
    setSets(sets.map((set, i) => (i === setIndex ? { ...set, ...data } : set)));
  };

  const handleTypeChange = (setIndex: number, columnIndex: number, newType: WorkoutSetType) => {
    const set = sets[setIndex];
    const newTypes = [...set.types];
    newTypes[columnIndex] = newType;
    updateSet(setIndex, { types: newTypes });
  };

  const handleValueIntChange = (setIndex: number, columnIndex: number, value: number) => {
    const set = sets[setIndex];
    const newValuesInt = [...set.valuesInt];
    newValuesInt[columnIndex] = value;
    updateSet(setIndex, { valuesInt: newValuesInt });
  };

  const handleValueSecChange = (setIndex: number, columnIndex: number, value: number) => {
    const set = sets[setIndex];
    const newValuesSec = [...set.valuesSec];
    newValuesSec[columnIndex] = value;
    updateSet(setIndex, { valuesSec: newValuesSec });
  };

  const handleUnitChange = (setIndex: number, columnIndex: number, newUnit: WorkoutSetUnit) => {
    const set = sets[setIndex];
    const newUnits = [...set.units];
    newUnits[columnIndex] = newUnit;
    updateSet(setIndex, { units: newUnits });
  };

  const addColumn = (setIndex: number) => {
    const set = sets[setIndex];
    if (set.types.length < MAX_WORKOUT_SET_COLUMNS) {
      const firstAvailableType = AVAILABLE_WORKOUT_SET_TYPES.find((t) => !set.types.includes(t));
      if (firstAvailableType) {
        const newTypes = [...set.types, firstAvailableType];
        updateSet(setIndex, { types: newTypes });
      }
    }
  };

  const removeColumn = (setIndex: number, columnIndex: number) => {
    const set = sets[setIndex];
    const newTypes = set.types.filter((_, idx) => idx !== columnIndex);
    const newValuesInt = set.valuesInt.filter((_, idx) => idx !== columnIndex);
    const newValuesSec = set.valuesSec.filter((_, idx) => idx !== columnIndex);
    const newUnits = set.units.filter((_, idx) => idx !== columnIndex);

    updateSet(setIndex, {
      types: newTypes,
      valuesInt: newValuesInt,
      valuesSec: newValuesSec,
      units: newUnits,
    });
  };

  const renderInputForType = (type: WorkoutSetType, setIndex: number, columnIndex: number) => {
    const set = sets[setIndex];

    switch (type) {
      case "TIME":
        return (
          <div className="flex gap-1 w-full">
            <input
              className="input input-bordered input-sm w-1/2 text-center font-semibold"
              min={0}
              onChange={(e) => handleValueIntChange(setIndex, columnIndex, parseInt(e.target.value) || 0)}
              placeholder="min"
              type="number"
              value={set.valuesInt[columnIndex] ?? ""}
            />
            <input
              className="input input-bordered input-sm w-1/2 text-center font-semibold"
              max={59}
              min={0}
              onChange={(e) => handleValueSecChange(setIndex, columnIndex, parseInt(e.target.value) || 0)}
              placeholder="sec"
              type="number"
              value={set.valuesSec[columnIndex] ?? ""}
            />
          </div>
        );
      case "WEIGHT":
        return (
          <div className="flex gap-1 w-full items-center">
            <input
              className="input input-bordered input-sm w-1/2 text-center font-semibold"
              min={0}
              onChange={(e) => handleValueIntChange(setIndex, columnIndex, parseInt(e.target.value) || 0)}
              type="number"
              value={set.valuesInt[columnIndex] ?? ""}
            />
            <select
              className="select select-bordered select-sm w-1/2 font-semibold"
              onChange={(e) => handleUnitChange(setIndex, columnIndex, e.target.value as WorkoutSetUnit)}
              value={set.units[columnIndex] ?? "kg"}
            >
              {WORKOUT_SET_UNITS_TUPLE.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        );
      case "REPS":
        return (
          <input
            className="input input-bordered input-sm w-full text-center font-semibold"
            min={0}
            onChange={(e) => handleValueIntChange(setIndex, columnIndex, parseInt(e.target.value) || 0)}
            type="number"
            value={set.valuesInt[columnIndex] ?? ""}
          />
        );
      case "BODYWEIGHT":
        return (
          <input
            className="input input-bordered input-sm w-full text-center font-semibold"
            readOnly
            value="✔"
          />
        );
      default:
        return null;
    }
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateExerciseSets(exercise.id, sets);
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error("Error saving sets:", error);
      alert(error instanceof Error ? error.message : "Erreur lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  };

  const getTypeLabel = (type: WorkoutSetType): string => {
    const labels: Record<WorkoutSetType, string> = {
      TIME: "Temps",
      WEIGHT: "Poids",
      REPS: "Répétitions",
      BODYWEIGHT: "Poids du corps",
      NA: "N/A",
    };
    return labels[type];
  };

  if (!open) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg">
            Éditer les séries - {exercise.exercise.name}
          </h3>
          <button className="btn btn-sm btn-circle btn-ghost" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-6">
          {sets.map((set, setIndex) => (
            <div className="card bg-base-200 shadow-sm" key={set.id || setIndex}>
              <div className="card-body p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="badge badge-primary font-semibold">
                    SÉRIE {setIndex + 1}
                  </div>
                  <button
                    className="btn btn-sm btn-error btn-outline"
                    disabled={sets.length <= 1}
                    onClick={() => removeSet(setIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Columns */}
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {set.types.map((type, columnIndex) => {
                      const availableTypes = AVAILABLE_WORKOUT_SET_TYPES.filter(
                        (option) => !set.types.includes(option) || option === type
                      );

                      return (
                        <div className="space-y-2" key={columnIndex}>
                          <div className="flex items-center gap-1">
                            <select
                              className="select select-bordered select-sm font-semibold flex-1"
                              onChange={(e) => handleTypeChange(setIndex, columnIndex, e.target.value as WorkoutSetType)}
                              value={type}
                            >
                              {availableTypes.map((availableType) => (
                                <option key={availableType} value={availableType}>
                                  {getTypeLabel(availableType)}
                                </option>
                              ))}
                            </select>
                            {set.types.length > 1 && (
                              <button
                                className="btn btn-sm btn-error btn-outline"
                                onClick={() => removeColumn(setIndex, columnIndex)}
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                          {renderInputForType(type, setIndex, columnIndex)}
                        </div>
                      );
                    })}
                  </div>

                  {/* Add column button */}
                  {set.types.length < MAX_WORKOUT_SET_COLUMNS && (
                    <button
                      className="btn btn-sm btn-outline w-full"
                      onClick={() => addColumn(setIndex)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter une colonne
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button className="btn btn-outline w-full" onClick={addSet}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une série
          </button>
        </div>

        <div className="modal-action">
          <button 
            className="btn btn-ghost" 
            disabled={isSaving}
            onClick={() => onOpenChange(false)}
          >
            Annuler
          </button>
          <button 
            className="btn btn-primary" 
            disabled={isSaving}
            onClick={handleSave}
          >
            {isSaving ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Sauvegarde...
              </>
            ) : (
              "Sauvegarder"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}