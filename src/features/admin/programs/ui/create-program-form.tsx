"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ProgramLevel, ExerciseAttributeValueEnum } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import { createProgram } from "../actions/create-program.action";

const programSchema = z.object({
  // Step 1: Basic info
  title: z.string().min(1, "Le titre est requis"),
  titleEn: z.string().min(1, "Le titre en anglais est requis"),
  description: z.string().min(1, "La description est requise"),
  descriptionEn: z.string().min(1, "La description en anglais est requise"),
  fullDescription: z.string().optional(),
  fullDescriptionEn: z.string().optional(),
  category: z.string().min(1, "La catégorie est requise"),
  image: z.string().url("URL d'image invalide"),
  level: z.nativeEnum(ProgramLevel),
  type: z.nativeEnum(ExerciseAttributeValueEnum),
  emoji: z.string().optional(),

  // Step 2: Configuration
  durationWeeks: z.number().min(1, "Au moins 1 semaine"),
  sessionsPerWeek: z.number().min(1, "Au moins 1 séance par semaine"),
  sessionDurationMin: z.number().min(5, "Au moins 5 minutes"),
  equipment: z.array(z.nativeEnum(ExerciseAttributeValueEnum)),
  isPremium: z.boolean(),

  // Step 3: Coaches
  coaches: z.array(z.object({
    name: z.string().min(1, "Le nom est requis"),
    image: z.string().url("URL d'image invalide"),
    order: z.number(),
  })),
});

type ProgramFormData = z.infer<typeof programSchema>;

interface CreateProgramFormProps {
  currentStep: number;
  onStepComplete: (step: number) => void;
  onSuccess: () => void;
  onCancel: () => void;
}

const EQUIPMENT_OPTIONS = [
  { value: ExerciseAttributeValueEnum.BODY_ONLY, label: "Poids du corps" },
  { value: ExerciseAttributeValueEnum.DUMBBELL, label: "Haltères" },
  { value: ExerciseAttributeValueEnum.BARBELL, label: "Barre" },
  { value: ExerciseAttributeValueEnum.KETTLEBELLS, label: "Kettlebells" },
  { value: ExerciseAttributeValueEnum.BANDS, label: "Élastiques" },
  { value: ExerciseAttributeValueEnum.MACHINE, label: "Machines" },
  { value: ExerciseAttributeValueEnum.CABLE, label: "Câbles" },
];

const TYPE_OPTIONS = [
  { value: ExerciseAttributeValueEnum.STRENGTH, label: "Musculation" },
  { value: ExerciseAttributeValueEnum.CARDIO, label: "Cardio" },
  { value: ExerciseAttributeValueEnum.BODYWEIGHT, label: "Poids du corps" },
  { value: ExerciseAttributeValueEnum.STRETCHING, label: "Étirements" },
  { value: ExerciseAttributeValueEnum.CALISTHENIC, label: "Callisthénie" },
];

export function CreateProgramForm({ currentStep, onStepComplete, onSuccess, onCancel }: CreateProgramFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<ExerciseAttributeValueEnum[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProgramFormData>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      level: ProgramLevel.BEGINNER,
      type: ExerciseAttributeValueEnum.STRENGTH,
      durationWeeks: 4,
      sessionsPerWeek: 3,
      sessionDurationMin: 30,
      isPremium: true,
      equipment: [],
      coaches: [],
    },
  });

  const coaches = watch("coaches") || [];

  const addCoach = () => {
    const newCoaches = [...coaches, { name: "", image: "", order: coaches.length }];
    setValue("coaches", newCoaches);
  };

  const removeCoach = (index: number) => {
    const newCoaches = coaches.filter((_, i) => i !== index);
    setValue("coaches", newCoaches);
  };

  const toggleEquipment = (equipment: ExerciseAttributeValueEnum) => {
    const newEquipment = selectedEquipment.includes(equipment)
      ? selectedEquipment.filter(e => e !== equipment)
      : [...selectedEquipment, equipment];
    
    setSelectedEquipment(newEquipment);
    setValue("equipment", newEquipment);
  };

  const onSubmit = async (data: ProgramFormData) => {
    if (currentStep < 3) {
      onStepComplete(currentStep);
      return;
    }

    setIsLoading(true);
    try {
      await createProgram(data);
      onSuccess();
    } catch (error) {
      console.error("Error creating program:", error);
      alert("Erreur lors de la création du programme");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle>Informations générales</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Titre (FR)</Label>
            <Input id="title" {...register("title")} />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          </div>
          <div>
            <Label htmlFor="titleEn">Titre (EN)</Label>
            <Input id="titleEn" {...register("titleEn")} />
            {errors.titleEn && <p className="text-sm text-red-500">{errors.titleEn.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="description">Description (FR)</Label>
            <Textarea id="description" {...register("description")} />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>
          <div>
            <Label htmlFor="descriptionEn">Description (EN)</Label>
            <Textarea id="descriptionEn" {...register("descriptionEn")} />
            {errors.descriptionEn && <p className="text-sm text-red-500">{errors.descriptionEn.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Catégorie</Label>
            <Input id="category" {...register("category")} placeholder="ex: Musculation" />
            {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
          </div>
          <div>
            <Label htmlFor="image">URL de l'image</Label>
            <Input id="image" {...register("image")} placeholder="https://..." />
            {errors.image && <p className="text-sm text-red-500">{errors.image.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="level">Niveau</Label>
            <Select onValueChange={(value) => setValue("level", value as ProgramLevel)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ProgramLevel.BEGINNER}>Débutant</SelectItem>
                <SelectItem value={ProgramLevel.INTERMEDIATE}>Intermédiaire</SelectItem>
                <SelectItem value={ProgramLevel.ADVANCED}>Avancé</SelectItem>
                <SelectItem value={ProgramLevel.EXPERT}>Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="type">Type</Label>
            <Select onValueChange={(value) => setValue("type", value as ExerciseAttributeValueEnum)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                {TYPE_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="emoji">Emoji (optionnel)</Label>
            <Input id="emoji" {...register("emoji")} placeholder="WorkoutCoolHappy.png" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle>Configuration du programme</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="durationWeeks">Durée (semaines)</Label>
            <Input
              id="durationWeeks"
              type="number"
              min="1"
              {...register("durationWeeks", { valueAsNumber: true })}
            />
            {errors.durationWeeks && <p className="text-sm text-red-500">{errors.durationWeeks.message}</p>}
          </div>
          <div>
            <Label htmlFor="sessionsPerWeek">Séances/semaine</Label>
            <Input
              id="sessionsPerWeek"
              type="number"
              min="1"
              {...register("sessionsPerWeek", { valueAsNumber: true })}
            />
            {errors.sessionsPerWeek && <p className="text-sm text-red-500">{errors.sessionsPerWeek.message}</p>}
          </div>
          <div>
            <Label htmlFor="sessionDurationMin">Durée séance (min)</Label>
            <Input
              id="sessionDurationMin"
              type="number"
              min="5"
              {...register("sessionDurationMin", { valueAsNumber: true })}
            />
            {errors.sessionDurationMin && <p className="text-sm text-red-500">{errors.sessionDurationMin.message}</p>}
          </div>
        </div>

        <div>
          <Label>Équipement requis</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {EQUIPMENT_OPTIONS.map(option => (
              <Badge
                key={option.value}
                variant={selectedEquipment.includes(option.value) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleEquipment(option.value)}
              >
                {option.label}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="isPremium"
            onCheckedChange={(checked) => setValue("isPremium", checked)}
            defaultChecked={true}
          />
          <Label htmlFor="isPremium">Programme premium</Label>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Coachs du programme
          <Button type="button" onClick={addCoach} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Ajouter
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {coaches.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Aucun coach ajouté. Cliquez sur "Ajouter" pour commencer.
          </p>
        ) : (
          coaches.map((_, index) => (
            <div key={index} className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor={`coach-name-${index}`}>Nom</Label>
                <Input
                  id={`coach-name-${index}`}
                  {...register(`coaches.${index}.name`)}
                  placeholder="Nom du coach"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor={`coach-image-${index}`}>URL de l'image</Label>
                <Input
                  id={`coach-image-${index}`}
                  {...register(`coaches.${index}.image`)}
                  placeholder="https://..."
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeCoach(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}

      <div className="flex justify-between pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {currentStep === 3 ? (isLoading ? "Création..." : "Créer le programme") : "Suivant"}
        </Button>
      </div>
    </form>
  );
}