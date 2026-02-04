"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { ExerciseWithStats } from "@/features/admin/exercises/types/exercise.types";
import { updateExercise } from "@/features/admin/exercises/actions/update-exercise.action";
import { getExerciseAttributeNames } from "@/features/admin/exercises/actions/get-exercises.action";

const exerciseSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  nameEn: z.string().min(1, "Le nom en anglais est requis"),
  description: z.string().optional(),
  descriptionEn: z.string().optional(),
  fullVideoUrl: z.string().url().optional().or(z.literal("")),
  fullVideoImageUrl: z.string().url().optional().or(z.literal("")),
  introduction: z.string().optional(),
  introductionEn: z.string().optional(),
  attributes: z.record(z.string()).optional(),
});

type ExerciseFormData = z.infer<typeof exerciseSchema>;

interface EditExerciseModalProps {
  exercise: ExerciseWithStats;
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
}

export function EditExerciseModal({ exercise, open, onOpenChangeAction }: EditExerciseModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [attributeNames, setAttributeNames] = useState<any[]>([]);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExerciseFormData>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      name: exercise.name,
      nameEn: exercise.nameEn || "",
      description: exercise.description || "",
      descriptionEn: exercise.descriptionEn || "",
      fullVideoUrl: exercise.fullVideoUrl || "",
      fullVideoImageUrl: exercise.fullVideoImageUrl || "",
      introduction: exercise.introduction || "",
      introductionEn: exercise.introductionEn || "",
      attributes: exercise.attributes.reduce(
        (acc, attr) => {
          acc[attr.attributeNameId] = attr.attributeValueId;
          return acc;
        },
        {} as Record<string, string>,
      ),
    },
  });

  useEffect(() => {
    if (open) {
      loadAttributeNames();
    }
  }, [open]);

  const loadAttributeNames = async () => {
    try {
      const data = await getExerciseAttributeNames();
      setAttributeNames(data);
    } catch (error) {
      console.error("Error loading attribute names:", error);
    }
  };

  const onSubmit = async (data: ExerciseFormData) => {
    setIsLoading(true);
    try {
      // Convert attributes object to array of IDs
      const attributeIds = Object.values(data.attributes || {}).filter(Boolean);

      await updateExercise({
        id: exercise.id,
        ...data,
        attributeIds,
      });
      handleClose();
      router.refresh();
    } catch (error) {
      console.error("Error updating exercise:", error);
      alert(error instanceof Error ? error.message : "Erreur lors de la mise à jour");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onOpenChangeAction(false);
  };

  return (
    <>
      {open && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">{"Modifier l'exercice"}</h3>
              <button className="btn btn-sm btn-circle btn-ghost" onClick={handleClose}>
                ✕
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Nom (FR) *</span>
                  </label>
                  <input className="input input-bordered" type="text" {...register("name")} placeholder="Ex: Pompes" />
                  {errors.name && <div className="text-sm text-error mt-1">{errors.name.message}</div>}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Nom (EN) *</span>
                  </label>
                  <input className="input input-bordered" type="text" {...register("nameEn")} placeholder="Ex: Push-ups" />
                  {errors.nameEn && <div className="text-sm text-error mt-1">{errors.nameEn.message}</div>}
                </div>
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Description (FR)</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered"
                    {...register("description")}
                    placeholder="Description de l'exercice..."
                    rows={3}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Description (EN)</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered"
                    {...register("descriptionEn")}
                    placeholder="Exercise description..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Media */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">URL Vidéo</span>
                  </label>
                  <input className="input input-bordered" type="url" {...register("fullVideoUrl")} placeholder="https://..." />
                  {errors.fullVideoUrl && <div className="text-sm text-error mt-1">{errors.fullVideoUrl.message}</div>}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">URL Image</span>
                  </label>
                  <input className="input input-bordered" type="url" {...register("fullVideoImageUrl")} placeholder="https://..." />
                  {errors.fullVideoImageUrl && <div className="text-sm text-error mt-1">{errors.fullVideoImageUrl.message}</div>}
                </div>
              </div>

              {/* Introductions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Introduction (FR)</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered"
                    {...register("introduction")}
                    placeholder="Introduction courte..."
                    rows={2}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Introduction (EN)</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered"
                    {...register("introductionEn")}
                    placeholder="Short introduction..."
                    rows={2}
                  />
                </div>
              </div>

              {/* Attributes */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Attributs</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {attributeNames.map((attrName) => (
                    <div className="form-control" key={attrName.id}>
                      <label className="label">
                        <span className="label-text">{attrName.name}</span>
                      </label>
                      <select className="select select-bordered" {...register(`attributes.${attrName.id}`)}>
                        <option value="">Sélectionner</option>
                        {attrName.values.map((value: any) => (
                          <option key={value.id} value={value.id}>
                            {value.value}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button className="btn btn-outline" onClick={handleClose} type="button">
                  Annuler
                </button>
                <button className="btn btn-primary" disabled={isLoading} type="submit">
                  {isLoading ? "Mise à jour..." : "Modifier l'exercice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
