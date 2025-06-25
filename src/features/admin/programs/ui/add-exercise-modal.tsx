"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Plus, Trash2, Search } from "lucide-react";
import { WorkoutSetType, WorkoutSetUnit } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";

import { SUGGESTED_SET_TEMPLATES } from "@/features/programs/lib/suggested-sets-helpers";

import { addExerciseToSession, getExercises } from "../actions/add-exercise.action";

const exerciseSchema = z.object({
  exerciseId: z.string().min(1, "Veuillez sélectionner un exercice"),
  instructions: z.string().min(1, "Les instructions sont requises"),
  instructionsEn: z.string().min(1, "Les instructions en anglais sont requises"),
  suggestedSets: z.array(
    z.object({
      setIndex: z.number(),
      types: z.array(z.nativeEnum(WorkoutSetType)),
      valuesInt: z.array(z.number()).optional(),
      valuesSec: z.array(z.number()).optional(),
      units: z.array(z.nativeEnum(WorkoutSetUnit)).optional(),
    }),
  ),
});

type ExerciseFormData = z.infer<typeof exerciseSchema>;

interface AddExerciseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionId: string;
  nextOrder: number;
}

export function AddExerciseModal({ open, onOpenChange, sessionId, nextOrder }: AddExerciseModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [exercises, setExercises] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [suggestedSets, setSuggestedSets] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ExerciseFormData>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      suggestedSets: [],
    },
  });

  const exerciseId = watch("exerciseId");

  // Load exercises
  useEffect(() => {
    if (open) {
      loadExercises();
    }
  }, [open, searchTerm]);

  const loadExercises = async () => {
    try {
      const data = await getExercises(searchTerm);
      setExercises(data);
    } catch (error) {
      console.error("Error loading exercises:", error);
    }
  };

  const selectExercise = (exercise: any) => {
    setSelectedExercise(exercise);
    setValue("exerciseId", exercise.id);

    // Set default suggested sets based on exercise type
    const defaultSets = SUGGESTED_SET_TEMPLATES.strengthTraining();
    setSuggestedSets(defaultSets);
    setValue("suggestedSets", defaultSets);
  };

  const addSet = () => {
    const newSet = {
      setIndex: suggestedSets.length,
      types: [WorkoutSetType.WEIGHT, WorkoutSetType.REPS],
      valuesInt: [20, 10],
      units: [WorkoutSetUnit.kg],
    };
    const newSets = [...suggestedSets, newSet];
    setSuggestedSets(newSets);
    setValue("suggestedSets", newSets);
  };

  const removeSet = (index: number) => {
    const newSets = suggestedSets.filter((_, i) => i !== index);
    // Reindex sets
    const reindexedSets = newSets.map((set, i) => ({ ...set, setIndex: i }));
    setSuggestedSets(reindexedSets);
    setValue("suggestedSets", reindexedSets);
  };

  const updateSet = (index: number, field: string, value: any) => {
    const newSets = [...suggestedSets];
    newSets[index] = { ...newSets[index], [field]: value };
    setSuggestedSets(newSets);
    setValue("suggestedSets", newSets);
  };

  const useTemplate = (template: string) => {
    let sets: any[] = [];
    switch (template) {
      case "strength":
        sets = SUGGESTED_SET_TEMPLATES.strengthTraining();
        break;
      case "bodyweight":
        sets = SUGGESTED_SET_TEMPLATES.bodyweight();
        break;
      case "timed":
        sets = SUGGESTED_SET_TEMPLATES.timed();
        break;
    }
    setSuggestedSets(sets);
    setValue("suggestedSets", sets);
  };

  const onSubmit = async (data: ExerciseFormData) => {
    setIsLoading(true);
    try {
      await addExerciseToSession({
        sessionId,
        exerciseId: data.exerciseId,
        order: nextOrder,
        instructions: data.instructions,
        instructionsEn: data.instructionsEn,
        suggestedSets: data.suggestedSets,
      });

      handleClose();
      window.location.reload(); // Refresh to show new exercise
    } catch (error) {
      console.error("Error adding exercise:", error);
      alert("Erreur lors de l'ajout de l'exercice");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedExercise(null);
    setSuggestedSets([]);
    setSearchTerm("");
    onOpenChange(false);
  };

  return (
    <>
      {open && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-4xl h-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Ajouter un exercice</h3>
              <button 
                className="btn btn-sm btn-circle btn-ghost"
                onClick={handleClose}
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6">
              {/* Exercise Selection */}
              {!selectedExercise && (
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h2 className="card-title">Sélectionner un exercice</h2>
                    <div className="space-y-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-base-content/60" />
                        <input
                          className="input input-bordered w-full pl-10"
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Rechercher un exercice..."
                          value={searchTerm}
                        />
                      </div>

                      <div className="grid gap-2 max-h-60 overflow-y-auto">
                        {exercises.map((exercise) => (
                          <div
                            className="flex items-center justify-between p-3 border border-base-300 rounded-lg cursor-pointer hover:bg-base-200"
                            key={exercise.id}
                            onClick={() => selectExercise(exercise)}
                          >
                            <div>
                              <h4 className="font-medium">{exercise.name}</h4>
                              <p className="text-sm text-base-content/60">{exercise.nameEn}</p>
                            </div>
                            <button className="btn btn-sm btn-primary">Sélectionner</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Selected Exercise & Configuration */}
              {selectedExercise && (
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                  {/* Exercise Info */}
                  <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="card-title">{selectedExercise.name}</h2>
                          <p className="text-sm text-base-content/60">{selectedExercise.nameEn}</p>
                        </div>
                        <button onClick={() => setSelectedExercise(null)} type="button" className="btn btn-outline">
                          Changer
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <h2 className="card-title">Instructions</h2>
                      <div className="space-y-4">
                        <div className="form-control">
                          <label className="label" htmlFor="instructions">
                            <span className="label-text">Instructions (FR)</span>
                          </label>
                          <textarea
                            id="instructions"
                            className="textarea textarea-bordered"
                            {...register("instructions")}
                            placeholder="Instructions spécifiques pour cet exercice dans ce programme..."
                            rows={3}
                          />
                          {errors.instructions && <div className="text-sm text-error mt-1">{errors.instructions.message}</div>}
                        </div>
                        <div className="form-control">
                          <label className="label" htmlFor="instructionsEn">
                            <span className="label-text">Instructions (EN)</span>
                          </label>
                          <textarea
                            id="instructionsEn"
                            className="textarea textarea-bordered"
                            {...register("instructionsEn")}
                            placeholder="Specific instructions for this exercise in this program..."
                            rows={3}
                          />
                          {errors.instructionsEn && <div className="text-sm text-error mt-1">{errors.instructionsEn.message}</div>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Suggested Sets */}
                  <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="card-title">Séries suggérées</h2>
                        <div className="flex gap-2">
                          <button onClick={() => useTemplate("strength")} className="btn btn-sm btn-outline" type="button">
                            Musculation
                          </button>
                          <button onClick={() => useTemplate("bodyweight")} className="btn btn-sm btn-outline" type="button">
                            Poids du corps
                          </button>
                          <button onClick={() => useTemplate("timed")} className="btn btn-sm btn-outline" type="button">
                            Chronométré
                          </button>
                          <button onClick={addSet} className="btn btn-sm btn-primary" type="button">
                            <Plus className="h-4 w-4 mr-1" />
                            Ajouter
                          </button>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {suggestedSets.map((set, index) => (
                          <div className="flex items-center gap-3 p-3 border border-base-300 rounded-lg" key={index}>
                            <div className="w-8 h-8 bg-primary text-primary-content rounded-full flex items-center justify-center text-sm font-semibold">
                              {index + 1}
                            </div>
                            <div className="flex-1 grid grid-cols-4 gap-2">
                              <div className="form-control">
                                <label className="label">
                                  <span className="label-text text-xs">Type</span>
                                </label>
                                <select 
                                  className="select select-bordered select-sm" 
                                  onChange={(e) => updateSet(index, "types", [e.target.value])} 
                                  value={set.types?.[0] || ""}
                                >
                                  <option value="">Sélectionner</option>
                                  <option value={WorkoutSetType.WEIGHT}>Poids</option>
                                  <option value={WorkoutSetType.REPS}>Répétitions</option>
                                  <option value={WorkoutSetType.TIME}>Temps</option>
                                  <option value={WorkoutSetType.BODYWEIGHT}>Poids du corps</option>
                                </select>
                              </div>
                              <div className="form-control">
                                <label className="label">
                                  <span className="label-text text-xs">Poids/Reps</span>
                                </label>
                                <input
                                  className="input input-bordered input-sm"
                                  onChange={(e) => updateSet(index, "valuesInt", [parseInt(e.target.value) || 0])}
                                  type="number"
                                  value={set.valuesInt?.[0] || ""}
                                />
                              </div>
                              <div className="form-control">
                                <label className="label">
                                  <span className="label-text text-xs">Temps (sec)</span>
                                </label>
                                <input
                                  className="input input-bordered input-sm"
                                  onChange={(e) => updateSet(index, "valuesSec", [parseInt(e.target.value) || 0])}
                                  type="number"
                                  value={set.valuesSec?.[0] || ""}
                                />
                              </div>
                              <div className="form-control">
                                <label className="label">
                                  <span className="label-text text-xs">Unité</span>
                                </label>
                                <select 
                                  className="select select-bordered select-sm" 
                                  onChange={(e) => updateSet(index, "units", [e.target.value])} 
                                  value={set.units?.[0] || ""}
                                >
                                  <option value="">Sélectionner</option>
                                  <option value={WorkoutSetUnit.kg}>kg</option>
                                  <option value={WorkoutSetUnit.lbs}>lbs</option>
                                </select>
                              </div>
                            </div>
                            <button onClick={() => removeSet(index)} className="btn btn-sm btn-outline" type="button">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}

                        {suggestedSets.length === 0 && (
                          <div className="text-center py-8 border-2 border-dashed border-base-300 rounded-lg">
                            <p className="text-base-content/60 mb-3">Aucune série configurée</p>
                            <button onClick={addSet} className="btn btn-sm btn-primary" type="button">
                              <Plus className="h-4 w-4 mr-1" />
                              Ajouter la première série
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <button onClick={handleClose} type="button" className="btn btn-outline">
                      Annuler
                    </button>
                    <button disabled={isLoading} type="submit" className="btn btn-primary">
                      {isLoading ? "Ajout..." : "Ajouter l'exercice"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
