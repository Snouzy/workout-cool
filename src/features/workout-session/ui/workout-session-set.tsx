import { Trash2 } from "lucide-react";

import { useI18n } from "locales/client";
import { WorkoutSet, BandLevel, FormQuality } from "@/features/workout-session/types/workout-set";
import { Button } from "@/components/ui/button";

interface WorkoutSetRowProps {
  set: WorkoutSet;
  setIndex: number;
  onChange: (setIndex: number, data: Partial<WorkoutSet>) => void;
  onFinish: () => void;
  onRemove: () => void;
}

const BAND_LEVELS: BandLevel[] = ["none", "light", "medium", "heavy", "extra_heavy"];
const FORM_QUALITIES: FormQuality[] = ["poor", "acceptable", "good", "excellent"];

export function WorkoutSessionSet({ set, setIndex, onChange, onFinish, onRemove }: WorkoutSetRowProps) {
  const t = useI18n();

  const handleRepsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value, 10) : undefined;
    onChange(setIndex, { reps: value });
  };

  const handleHoldTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value, 10) : undefined;
    onChange(setIndex, { holdTimeSeconds: value });
  };

  const handleBandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(setIndex, { bandUsed: e.target.value as BandLevel });
  };

  const handleFormQualityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onChange(setIndex, { formQuality: value ? (value as FormQuality) : undefined });
  };

  const handleRpeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value, 10) : undefined;
    onChange(setIndex, { rpe: value });
  };

  const handleEdit = () => {
    onChange(setIndex, { completed: false });
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

      {/* Calisthenics-focused inputs */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-2 w-full">
        {/* Reps input */}
        <div className="flex flex-col w-full md:w-auto">
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
            {t("workout_builder.session.reps")}
          </label>
          <input
            className="border border-black rounded px-1 py-2 w-full text-base text-center font-bold dark:bg-slate-800"
            disabled={set.completed}
            min={0}
            onChange={handleRepsChange}
            pattern="[0-9]*"
            placeholder="0"
            type="number"
            value={set.reps ?? ""}
          />
        </div>

        {/* Hold time input */}
        <div className="flex flex-col w-full md:w-auto">
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
            {t("workout_builder.session.time")} (sec)
          </label>
          <input
            className="border border-black rounded px-1 py-2 w-full text-base text-center font-bold dark:bg-slate-800"
            disabled={set.completed}
            min={0}
            onChange={handleHoldTimeChange}
            pattern="[0-9]*"
            placeholder="0"
            type="number"
            value={set.holdTimeSeconds ?? ""}
          />
        </div>

        {/* Band level select */}
        <div className="flex flex-col w-full md:w-auto">
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Band</label>
          <select
            className="border border-black dark:border-slate-700 rounded font-bold px-1 py-2 text-base w-full bg-white dark:bg-slate-800 dark:text-gray-200 h-10"
            disabled={set.completed}
            onChange={handleBandChange}
            value={set.bandUsed ?? "none"}
          >
            {BAND_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level === "none" ? "No band" : level.charAt(0).toUpperCase() + level.slice(1).replace("_", " ")}
              </option>
            ))}
          </select>
        </div>

        {/* Form quality select */}
        <div className="flex flex-col w-full md:w-auto">
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Form</label>
          <select
            className="border border-black dark:border-slate-700 rounded font-bold px-1 py-2 text-base w-full bg-white dark:bg-slate-800 dark:text-gray-200 h-10"
            disabled={set.completed}
            onChange={handleFormQualityChange}
            value={set.formQuality ?? ""}
          >
            <option value="">-</option>
            {FORM_QUALITIES.map((quality) => (
              <option key={quality} value={quality}>
                {quality.charAt(0).toUpperCase() + quality.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* RPE input */}
        <div className="flex flex-col w-full md:w-auto">
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">RPE (1-10)</label>
          <input
            className="border border-black rounded px-1 py-2 w-full text-base text-center font-bold dark:bg-slate-800"
            disabled={set.completed}
            max={10}
            min={1}
            onChange={handleRpeChange}
            pattern="[0-9]*"
            placeholder="-"
            type="number"
            value={set.rpe ?? ""}
          />
        </div>
      </div>

      {/* Finish & Edit buttons, full width on mobile */}
      <div className="flex gap-2 w-full md:w-auto mt-2">
        <Button
          className="dark:text-white font-bold px-4 py-2 text-sm rounded-xl flex-1"
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
