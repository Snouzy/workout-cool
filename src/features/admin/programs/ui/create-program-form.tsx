"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ProgramLevel, ExerciseAttributeValueEnum } from "@prisma/client";
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
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Informations générales</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label" htmlFor="title">
                <span className="label-text">Titre (FR)</span>
              </label>
              <input id="title" className="input input-bordered" {...register("title")} />
              {errors.title && <div className="text-sm text-error mt-1">{errors.title.message}</div>}
            </div>
            <div className="form-control">
              <label className="label" htmlFor="titleEn">
                <span className="label-text">Titre (EN)</span>
              </label>
              <input id="titleEn" className="input input-bordered" {...register("titleEn")} />
              {errors.titleEn && <div className="text-sm text-error mt-1">{errors.titleEn.message}</div>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label" htmlFor="description">
                <span className="label-text">Description (FR)</span>
              </label>
              <textarea id="description" className="textarea textarea-bordered" {...register("description")} />
              {errors.description && <div className="text-sm text-error mt-1">{errors.description.message}</div>}
            </div>
            <div className="form-control">
              <label className="label" htmlFor="descriptionEn">
                <span className="label-text">Description (EN)</span>
              </label>
              <textarea id="descriptionEn" className="textarea textarea-bordered" {...register("descriptionEn")} />
              {errors.descriptionEn && <div className="text-sm text-error mt-1">{errors.descriptionEn.message}</div>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label" htmlFor="category">
                <span className="label-text">Catégorie</span>
              </label>
              <input id="category" className="input input-bordered" {...register("category")} placeholder="ex: Musculation" />
              {errors.category && <div className="text-sm text-error mt-1">{errors.category.message}</div>}
            </div>
            <div className="form-control">
              <label className="label" htmlFor="image">
                <span className="label-text">URL de l'image</span>
              </label>
              <input id="image" className="input input-bordered" {...register("image")} placeholder="https://..." />
              {errors.image && <div className="text-sm text-error mt-1">{errors.image.message}</div>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="form-control">
              <label className="label" htmlFor="level">
                <span className="label-text">Niveau</span>
              </label>
              <select 
                className="select select-bordered" 
                onChange={(e) => setValue("level", e.target.value as ProgramLevel)}
                defaultValue={ProgramLevel.BEGINNER}
              >
                <option value={ProgramLevel.BEGINNER}>Débutant</option>
                <option value={ProgramLevel.INTERMEDIATE}>Intermédiaire</option>
                <option value={ProgramLevel.ADVANCED}>Avancé</option>
                <option value={ProgramLevel.EXPERT}>Expert</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label" htmlFor="type">
                <span className="label-text">Type</span>
              </label>
              <select 
                className="select select-bordered" 
                onChange={(e) => setValue("type", e.target.value as ExerciseAttributeValueEnum)}
                defaultValue={ExerciseAttributeValueEnum.STRENGTH}
              >
                {TYPE_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-control">
              <label className="label" htmlFor="emoji">
                <span className="label-text">Emoji (optionnel)</span>
              </label>
              <input id="emoji" className="input input-bordered" {...register("emoji")} placeholder="WorkoutCoolHappy.png" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Configuration du programme</h2>
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="form-control">
              <label className="label" htmlFor="durationWeeks">
                <span className="label-text">Durée (semaines)</span>
              </label>
              <input
                id="durationWeeks"
                type="number"
                min="1"
                className="input input-bordered"
                {...register("durationWeeks", { valueAsNumber: true })}
              />
              {errors.durationWeeks && <div className="text-sm text-error mt-1">{errors.durationWeeks.message}</div>}
            </div>
            <div className="form-control">
              <label className="label" htmlFor="sessionsPerWeek">
                <span className="label-text">Séances/semaine</span>
              </label>
              <input
                id="sessionsPerWeek"
                type="number"
                min="1"
                className="input input-bordered"
                {...register("sessionsPerWeek", { valueAsNumber: true })}
              />
              {errors.sessionsPerWeek && <div className="text-sm text-error mt-1">{errors.sessionsPerWeek.message}</div>}
            </div>
            <div className="form-control">
              <label className="label" htmlFor="sessionDurationMin">
                <span className="label-text">Durée séance (min)</span>
              </label>
              <input
                id="sessionDurationMin"
                type="number"
                min="5"
                className="input input-bordered"
                {...register("sessionDurationMin", { valueAsNumber: true })}
              />
              {errors.sessionDurationMin && <div className="text-sm text-error mt-1">{errors.sessionDurationMin.message}</div>}
            </div>
          </div>

          <div>
            <label className="label">
              <span className="label-text">Équipement requis</span>
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {EQUIPMENT_OPTIONS.map(option => (
                <div
                  key={option.value}
                  className={`badge cursor-pointer ${
                    selectedEquipment.includes(option.value) ? "badge-primary" : "badge-outline"
                  }`}
                  onClick={() => toggleEquipment(option.value)}
                >
                  {option.label}
                </div>
              ))}
            </div>
          </div>

          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-2">
              <input
                type="checkbox"
                className="toggle toggle-primary"
                id="isPremium"
                onChange={(e) => setValue("isPremium", e.target.checked)}
                defaultChecked={true}
              />
              <span className="label-text">Programme premium</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-center justify-between mb-4">
          <h2 className="card-title">Coachs du programme</h2>
          <button type="button" className="btn btn-sm btn-primary" onClick={addCoach}>
            <Plus className="h-4 w-4 mr-1" />
            Ajouter
          </button>
        </div>
        <div className="space-y-4">
          {coaches.length === 0 ? (
            <p className="text-base-content/60 text-center py-8">
              Aucun coach ajouté. Cliquez sur "Ajouter" pour commencer.
            </p>
          ) : (
            coaches.map((_, index) => (
              <div key={index} className="flex gap-4 items-end">
                <div className="flex-1 form-control">
                  <label className="label" htmlFor={`coach-name-${index}`}>
                    <span className="label-text">Nom</span>
                  </label>
                  <input
                    id={`coach-name-${index}`}
                    className="input input-bordered"
                    {...register(`coaches.${index}.name`)}
                    placeholder="Nom du coach"
                  />
                </div>
                <div className="flex-1 form-control">
                  <label className="label" htmlFor={`coach-image-${index}`}>
                    <span className="label-text">URL de l'image</span>
                  </label>
                  <input
                    id={`coach-image-${index}`}
                    className="input input-bordered"
                    {...register(`coaches.${index}.image`)}
                    placeholder="https://..."
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => removeCoach(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}

      <div className="flex justify-between pt-6 border-t border-base-300">
        <button type="button" className="btn btn-outline" onClick={onCancel}>
          Annuler
        </button>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {currentStep === 3 ? (isLoading ? "Création..." : "Créer le programme") : "Suivant"}
        </button>
      </div>
    </form>
  );
}