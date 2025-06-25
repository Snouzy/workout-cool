"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Plus, Trash2, Search } from "lucide-react";
import { WorkoutSetType, WorkoutSetUnit } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";

import { SUGGESTED_SET_TEMPLATES } from "@/features/programs/lib/suggested-sets-helpers";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    <Dialog onOpenChange={handleClose} open={open}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Ajouter un exercice</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Exercise Selection */}
          {!selectedExercise && (
            <Card>
              <CardHeader>
                <CardTitle>Sélectionner un exercice</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-10"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher un exercice..."
                    value={searchTerm}
                  />
                </div>

                <div className="grid gap-2 max-h-60 overflow-y-auto">
                  {exercises.map((exercise) => (
                    <div
                      className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
                      key={exercise.id}
                      onClick={() => selectExercise(exercise)}
                    >
                      <div>
                        <h4 className="font-medium">{exercise.name}</h4>
                        <p className="text-sm text-muted-foreground">{exercise.nameEn}</p>
                      </div>
                      <Button size="small">Sélectionner</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Selected Exercise & Configuration */}
          {selectedExercise && (
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Exercise Info */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{selectedExercise.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{selectedExercise.nameEn}</p>
                    </div>
                    <Button onClick={() => setSelectedExercise(null)} type="button" variant="outline">
                      Changer
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              {/* Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle>Instructions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="instructions">Instructions (FR)</Label>
                    <Textarea
                      id="instructions"
                      {...register("instructions")}
                      placeholder="Instructions spécifiques pour cet exercice dans ce programme..."
                      rows={3}
                    />
                    {errors.instructions && <p className="text-sm text-red-500 mt-1">{errors.instructions.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="instructionsEn">Instructions (EN)</Label>
                    <Textarea
                      id="instructionsEn"
                      {...register("instructionsEn")}
                      placeholder="Specific instructions for this exercise in this program..."
                      rows={3}
                    />
                    {errors.instructionsEn && <p className="text-sm text-red-500 mt-1">{errors.instructionsEn.message}</p>}
                  </div>
                </CardContent>
              </Card>

              {/* Suggested Sets */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Séries suggérées</CardTitle>
                    <div className="flex gap-2">
                      <Button onClick={() => useTemplate("strength")} size="small" type="button" variant="outline">
                        Musculation
                      </Button>
                      <Button onClick={() => useTemplate("bodyweight")} size="small" type="button" variant="outline">
                        Poids du corps
                      </Button>
                      <Button onClick={() => useTemplate("timed")} size="small" type="button" variant="outline">
                        Chronométré
                      </Button>
                      <Button onClick={addSet} size="small" type="button">
                        <Plus className="h-4 w-4 mr-1" />
                        Ajouter
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {suggestedSets.map((set, index) => (
                    <div className="flex items-center gap-3 p-3 border rounded-lg" key={index}>
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div className="flex-1 grid grid-cols-4 gap-2">
                        <div>
                          <Label className="text-xs">Type</Label>
                          <Select onValueChange={(value) => updateSet(index, "types", [value])} value={set.types?.[0] || ""}>
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={WorkoutSetType.WEIGHT}>Poids</SelectItem>
                              <SelectItem value={WorkoutSetType.REPS}>Répétitions</SelectItem>
                              <SelectItem value={WorkoutSetType.TIME}>Temps</SelectItem>
                              <SelectItem value={WorkoutSetType.BODYWEIGHT}>Poids du corps</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs">Poids/Reps</Label>
                          <Input
                            className="h-8"
                            onChange={(e) => updateSet(index, "valuesInt", [parseInt(e.target.value) || 0])}
                            type="number"
                            value={set.valuesInt?.[0] || ""}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Temps (sec)</Label>
                          <Input
                            className="h-8"
                            onChange={(e) => updateSet(index, "valuesSec", [parseInt(e.target.value) || 0])}
                            type="number"
                            value={set.valuesSec?.[0] || ""}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Unité</Label>
                          <Select onValueChange={(value) => updateSet(index, "units", [value])} value={set.units?.[0] || ""}>
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={WorkoutSetUnit.kg}>kg</SelectItem>
                              <SelectItem value={WorkoutSetUnit.lbs}>lbs</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button onClick={() => removeSet(index)} size="small" type="button" variant="outline">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {suggestedSets.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
                      <p className="text-muted-foreground mb-3">Aucune série configurée</p>
                      <Button onClick={addSet} size="small" type="button">
                        <Plus className="h-4 w-4 mr-1" />
                        Ajouter la première série
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-end gap-2 pt-4">
                <Button onClick={handleClose} type="button" variant="outline">
                  Annuler
                </Button>
                <Button disabled={isLoading} type="submit">
                  {isLoading ? "Ajout..." : "Ajouter l'exercice"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
