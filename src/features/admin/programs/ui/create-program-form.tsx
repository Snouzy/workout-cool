"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { ProgramLevel, ExerciseAttributeValueEnum } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";

import { createProgram } from "../actions/create-program.action";

const programSchema = z.object({
  // Step 1: Basic info
  title: z.string().min(1, "Le titre est requis"),
  titleEn: z.string().min(1, "Le titre en anglais est requis"),
  titleEs: z.string().min(1, "Le titre en espagnol est requis"),
  titlePt: z.string().min(1, "Le titre en portugais est requis"),
  titleRu: z.string().min(1, "Le titre en russe est requis"),
  titleZhCn: z.string().min(1, "Le titre en chinois est requis"),
  description: z.string().min(1, "La description est requise"),
  descriptionEn: z.string().min(1, "La description en anglais est requise"),
  descriptionEs: z.string().min(1, "La description en espagnol est requise"),
  descriptionPt: z.string().min(1, "La description en portugais est requise"),
  descriptionRu: z.string().min(1, "La description en russe est requise"),
  descriptionZhCn: z.string().min(1, "La description en chinois est requise"),
  category: z.string().min(1, "La catégorie est requise"),
  image: z.string().url("URL d'image invalide"),
  level: z.nativeEnum(ProgramLevel),
  type: z.nativeEnum(ExerciseAttributeValueEnum),

  // Step 2: Configuration
  durationWeeks: z.number().min(1, "Au moins 1 semaine"),
  sessionsPerWeek: z.number().min(1, "Au moins 1 séance par semaine"),
  sessionDurationMin: z.number().min(5, "Au moins 5 minutes"),
  equipment: z.array(z.nativeEnum(ExerciseAttributeValueEnum)),
  isPremium: z.boolean(),

  // Step 3: Coaches
  coaches: z.array(
    z.object({
      name: z.string().min(1, "Le nom est requis"),
      image: z.string().url("URL d'image invalide"),
      order: z.number(),
    }),
  ),
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
  const [activeTab, setActiveTab] = useState("fr");

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
      title: "",
      titleEn: "",
      titleEs: "",
      titlePt: "",
      titleRu: "",
      titleZhCn: "",
      description: "",
      descriptionEn: "",
      descriptionEs: "",
      descriptionPt: "",
      descriptionRu: "",
      descriptionZhCn: "",
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
      ? selectedEquipment.filter((e) => e !== equipment)
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
        
        {/* Language Tabs */}
        <div className="tabs tabs-boxed mb-6">
          <button className={`tab ${activeTab === "fr" ? "tab-active" : ""}`} onClick={() => setActiveTab("fr")} type="button">
            🇫🇷 FR
          </button>
          <button className={`tab ${activeTab === "en" ? "tab-active" : ""}`} onClick={() => setActiveTab("en")} type="button">
            🇺🇸 EN
          </button>
          <button className={`tab ${activeTab === "es" ? "tab-active" : ""}`} onClick={() => setActiveTab("es")} type="button">
            🇪🇸 ES
          </button>
          <button className={`tab ${activeTab === "pt" ? "tab-active" : ""}`} onClick={() => setActiveTab("pt")} type="button">
            🇵🇹 PT
          </button>
          <button className={`tab ${activeTab === "ru" ? "tab-active" : ""}`} onClick={() => setActiveTab("ru")} type="button">
            🇷🇺 RU
          </button>
          <button className={`tab ${activeTab === "zh" ? "tab-active" : ""}`} onClick={() => setActiveTab("zh")} type="button">
            🇨🇳 ZH
          </button>
        </div>

        <div className="space-y-4">
          {/* French Fields */}
          {activeTab === "fr" && (
            <div className="space-y-4">
              <div className="form-control">
                <label className="label" htmlFor="title">
                  <span className="label-text">Titre (Français)</span>
                </label>
                <input className="input input-bordered" id="title" {...register("title")} />
                {errors.title && <div className="text-sm text-error mt-1">{errors.title.message}</div>}
              </div>
              <div className="form-control">
                <label className="label" htmlFor="description">
                  <span className="label-text">Description (Français)</span>
                </label>
                <textarea className="textarea textarea-bordered h-24" id="description" {...register("description")} />
                {errors.description && <div className="text-sm text-error mt-1">{errors.description.message}</div>}
              </div>
            </div>
          )}

          {/* English Fields */}
          {activeTab === "en" && (
            <div className="space-y-4">
              <div className="form-control">
                <label className="label" htmlFor="titleEn">
                  <span className="label-text">Title (English)</span>
                </label>
                <input className="input input-bordered" id="titleEn" {...register("titleEn")} />
                {errors.titleEn && <div className="text-sm text-error mt-1">{errors.titleEn.message}</div>}
              </div>
              <div className="form-control">
                <label className="label" htmlFor="descriptionEn">
                  <span className="label-text">Description (English)</span>
                </label>
                <textarea className="textarea textarea-bordered h-24" id="descriptionEn" {...register("descriptionEn")} />
                {errors.descriptionEn && <div className="text-sm text-error mt-1">{errors.descriptionEn.message}</div>}
              </div>
            </div>
          )}

          {/* Spanish Fields */}
          {activeTab === "es" && (
            <div className="space-y-4">
              <div className="form-control">
                <label className="label" htmlFor="titleEs">
                  <span className="label-text">Título (Español)</span>
                </label>
                <input className="input input-bordered" id="titleEs" {...register("titleEs")} />
                {errors.titleEs && <div className="text-sm text-error mt-1">{errors.titleEs.message}</div>}
              </div>
              <div className="form-control">
                <label className="label" htmlFor="descriptionEs">
                  <span className="label-text">Descripción (Español)</span>
                </label>
                <textarea className="textarea textarea-bordered h-24" id="descriptionEs" {...register("descriptionEs")} />
                {errors.descriptionEs && <div className="text-sm text-error mt-1">{errors.descriptionEs.message}</div>}
              </div>
            </div>
          )}

          {/* Portuguese Fields */}
          {activeTab === "pt" && (
            <div className="space-y-4">
              <div className="form-control">
                <label className="label" htmlFor="titlePt">
                  <span className="label-text">Título (Português)</span>
                </label>
                <input className="input input-bordered" id="titlePt" {...register("titlePt")} />
                {errors.titlePt && <div className="text-sm text-error mt-1">{errors.titlePt.message}</div>}
              </div>
              <div className="form-control">
                <label className="label" htmlFor="descriptionPt">
                  <span className="label-text">Descrição (Português)</span>
                </label>
                <textarea className="textarea textarea-bordered h-24" id="descriptionPt" {...register("descriptionPt")} />
                {errors.descriptionPt && <div className="text-sm text-error mt-1">{errors.descriptionPt.message}</div>}
              </div>
            </div>
          )}

          {/* Russian Fields */}
          {activeTab === "ru" && (
            <div className="space-y-4">
              <div className="form-control">
                <label className="label" htmlFor="titleRu">
                  <span className="label-text">Название (Русский)</span>
                </label>
                <input className="input input-bordered" id="titleRu" {...register("titleRu")} />
                {errors.titleRu && <div className="text-sm text-error mt-1">{errors.titleRu.message}</div>}
              </div>
              <div className="form-control">
                <label className="label" htmlFor="descriptionRu">
                  <span className="label-text">Описание (Русский)</span>
                </label>
                <textarea className="textarea textarea-bordered h-24" id="descriptionRu" {...register("descriptionRu")} />
                {errors.descriptionRu && <div className="text-sm text-error mt-1">{errors.descriptionRu.message}</div>}
              </div>
            </div>
          )}

          {/* Chinese Fields */}
          {activeTab === "zh" && (
            <div className="space-y-4">
              <div className="form-control">
                <label className="label" htmlFor="titleZhCn">
                  <span className="label-text">标题 (中文)</span>
                </label>
                <input className="input input-bordered" id="titleZhCn" {...register("titleZhCn")} />
                {errors.titleZhCn && <div className="text-sm text-error mt-1">{errors.titleZhCn.message}</div>}
              </div>
              <div className="form-control">
                <label className="label" htmlFor="descriptionZhCn">
                  <span className="label-text">描述 (中文)</span>
                </label>
                <textarea className="textarea textarea-bordered h-24" id="descriptionZhCn" {...register("descriptionZhCn")} />
                {errors.descriptionZhCn && <div className="text-sm text-error mt-1">{errors.descriptionZhCn.message}</div>}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label" htmlFor="category">
                <span className="label-text">Catégorie</span>
              </label>
              <input className="input input-bordered" id="category" {...register("category")} placeholder="ex: Musculation" />
              {errors.category && <div className="text-sm text-error mt-1">{errors.category.message}</div>}
            </div>
            <div className="form-control">
              <label className="label" htmlFor="image">
                <span className="label-text">URL de l&apos;image</span>
              </label>
              <input className="input input-bordered" id="image" {...register("image")} placeholder="https://..." />
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
                defaultValue={ProgramLevel.BEGINNER}
                onChange={(e) => setValue("level", e.target.value as ProgramLevel)}
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
                defaultValue={ExerciseAttributeValueEnum.STRENGTH}
                onChange={(e) => setValue("type", e.target.value as ExerciseAttributeValueEnum)}
              >
                {TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
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
                className="input input-bordered"
                id="durationWeeks"
                min="1"
                type="number"
                {...register("durationWeeks", { valueAsNumber: true })}
              />
              {errors.durationWeeks && <div className="text-sm text-error mt-1">{errors.durationWeeks.message}</div>}
            </div>
            <div className="form-control">
              <label className="label" htmlFor="sessionsPerWeek">
                <span className="label-text">Séances/semaine</span>
              </label>
              <input
                className="input input-bordered"
                id="sessionsPerWeek"
                min="1"
                type="number"
                {...register("sessionsPerWeek", { valueAsNumber: true })}
              />
              {errors.sessionsPerWeek && <div className="text-sm text-error mt-1">{errors.sessionsPerWeek.message}</div>}
            </div>
            <div className="form-control">
              <label className="label" htmlFor="sessionDurationMin">
                <span className="label-text">Durée séance (min)</span>
              </label>
              <input
                className="input input-bordered"
                id="sessionDurationMin"
                min="5"
                type="number"
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
              {EQUIPMENT_OPTIONS.map((option) => (
                <div
                  className={`badge cursor-pointer ${selectedEquipment.includes(option.value) ? "badge-primary" : "badge-outline"}`}
                  key={option.value}
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
                className="toggle toggle-primary"
                defaultChecked={true}
                id="isPremium"
                onChange={(e) => setValue("isPremium", e.target.checked)}
                type="checkbox"
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
          <button className="btn btn-sm btn-primary" onClick={addCoach} type="button">
            <Plus className="h-4 w-4 mr-1" />
            Ajouter
          </button>
        </div>
        <div className="space-y-4">
          {coaches.length === 0 ? (
            <p className="text-base-content/60 text-center py-8">Aucun coach ajouté. Cliquez sur &quot;Ajouter&quot; pour commencer.</p>
          ) : (
            coaches.map((_, index) => (
              <div className="flex gap-4 items-end" key={index}>
                <div className="flex-1 form-control">
                  <label className="label" htmlFor={`coach-name-${index}`}>
                    <span className="label-text">Nom</span>
                  </label>
                  <input
                    className="input input-bordered"
                    id={`coach-name-${index}`}
                    {...register(`coaches.${index}.name`)}
                    placeholder="Nom du coach"
                  />
                </div>
                <div className="flex-1 form-control">
                  <label className="label" htmlFor={`coach-image-${index}`}>
                    <span className="label-text">URL de l&apos;image</span>
                  </label>
                  <input
                    className="input input-bordered"
                    id={`coach-image-${index}`}
                    {...register(`coaches.${index}.image`)}
                    placeholder="https://..."
                  />
                </div>
                <button className="btn btn-outline btn-sm" onClick={() => removeCoach(index)} type="button">
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
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}

      <div className="flex justify-between pt-6 border-t border-base-300">
        <button className="btn btn-outline" onClick={onCancel} type="button">
          Annuler
        </button>
        <button className="btn btn-primary" disabled={isLoading} type="submit">
          {currentStep === 3 ? (isLoading ? "Création..." : "Créer le programme") : "Suivant"}
        </button>
      </div>
    </form>
  );
}
