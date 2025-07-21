import { useEffect, useRef } from "react";
import Image from "next/image";
import { X, Play } from "lucide-react";
import { ExerciseAttributeNameEnum } from "@prisma/client";

import { useCurrentLocale, useI18n } from "locales/client";
import { getExerciseAttributesValueOf } from "@/entities/exercise/shared/muscles";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import type { ExerciseWithAttributes } from "../types";

interface ExercisePickModalProps {
  exercise: ExerciseWithAttributes | null;
  muscle: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirmPick: () => void;
}

export function ExercisePickModal({ exercise, muscle, isOpen, onClose, onConfirmPick }: ExercisePickModalProps) {
  const t = useI18n();
  const locale = useCurrentLocale();
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    if (isOpen) {
      modal.showModal();
    } else {
      modal.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const handleClose = () => {
      onClose();
    };

    modal.addEventListener("close", handleClose);
    return () => modal.removeEventListener("close", handleClose);
  }, [onClose]);

  if (!exercise) return null;

  const exerciseName = locale === "fr" ? exercise.name : exercise.nameEn;
  const exerciseDescription = locale === "fr" ? exercise.description : exercise.descriptionEn;

  // Extraire les attributs utiles
  const equipmentAttributes = getExerciseAttributesValueOf(exercise, ExerciseAttributeNameEnum.EQUIPMENT);
  const typeAttributes = getExerciseAttributesValueOf(exercise, ExerciseAttributeNameEnum.TYPE);
  const mechanicsTypeValue = getExerciseAttributesValueOf(exercise, ExerciseAttributeNameEnum.MECHANICS_TYPE);

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    onConfirmPick();
    onClose();
  };

  return (
    <dialog className="modal modal-bottom sm:modal-middle" ref={modalRef}>
      <div className="modal-box max-w-2xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">{exerciseName}</h3>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" variant="outline">
                {t(`workout_builder.muscles.${muscle.toLowerCase()}` as keyof typeof t)}
              </Badge>
              {mechanicsTypeValue && (
                <Badge className="text-xs" variant="outline">
                  {mechanicsTypeValue.map((value) => value.replace("_", " "))}
                </Badge>
              )}
            </div>
          </div>
          <form method="dialog">
            <Button className="p-1" size="small" variant="ghost">
              <X className="h-4 w-4" />
            </Button>
          </form>
        </div>

        {/* Image/Video */}
        {exercise.fullVideoImageUrl && (
          <div className="relative h-48 bg-gradient-to-br from-slate-200 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-lg overflow-hidden mb-4">
            <Image
              alt={exerciseName || "Exercise"}
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              src={exercise.fullVideoImageUrl}
            />
            {exercise.fullVideoUrl && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <Button className="bg-white/90 text-slate-900" size="small" variant="secondary">
                  <Play className="h-4 w-4 mr-2" />
                  {t("workout_builder.exercise.watch_video")}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Description */}
        {exerciseDescription && (
          <div className="mb-4">
            <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-2">Description</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{exerciseDescription}</p>
          </div>
        )}

        {/* Attributes */}
        <div className="space-y-3 mb-6">
          {/* Equipment */}
          {equipmentAttributes.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-2">Equipment</h4>
              <div className="flex flex-wrap gap-1">
                {equipmentAttributes.map((equipment, index) => (
                  <Badge className="text-xs" key={index} variant="outline">
                    {equipment.replace("_", " ")}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Exercise Types */}
          {typeAttributes.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-2">Exercise Types</h4>
              <div className="flex flex-wrap gap-1">
                {typeAttributes.map((type, index) => (
                  <Badge
                    className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100"
                    key={index}
                    variant="default"
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="modal-action">
          <form className="flex gap-2" method="dialog">
            <Button size="small" variant="outline">
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleConfirm} size="small">
              ⭐ Confirm Pick
            </Button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
