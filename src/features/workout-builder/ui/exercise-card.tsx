import { useState } from "react";
import Image from "next/image";
import { Play, Shuffle, MoreVertical, Trash2, Info, Target } from "lucide-react";
import { ExerciseAttributeNameEnum } from "@prisma/client";

import { useI18n } from "locales/client";
import { getExerciseAttributesValueOf } from "@/entities/exercise/shared/muscles";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { ExerciseVideoModal } from "./exercise-video-modal";

import type { ExerciseWithAttributes } from "../types";

interface ExerciseCardProps {
  exercise: ExerciseWithAttributes;
  muscle: string;
  onShuffle: (exerciseId: string, muscle: string) => void;
  onPick: (exerciseId: string) => void;
  onDelete: (exerciseId: string, muscle: string) => void;
}

export function ExerciseCard({ exercise, muscle, onShuffle, onPick, onDelete }: ExerciseCardProps) {
  const t = useI18n();
  const [imageError, setImageError] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  // Extraire les attributs utiles
  const equipmentAttributes = getExerciseAttributesValueOf(exercise, ExerciseAttributeNameEnum.EQUIPMENT);
  const typeAttributes = getExerciseAttributesValueOf(exercise, ExerciseAttributeNameEnum.TYPE);
  const mechanicsTypeValue = getExerciseAttributesValueOf(exercise, ExerciseAttributeNameEnum.MECHANICS_TYPE);

  const handlePlayVideo = () => {
    setShowVideo(true);
  };

  return (
    <TooltipProvider>
      <Card className="group relative overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-200 hover:border-blue-200 dark:hover:border-blue-800">
        <CardHeader className="relative p-0">
          {/* Image/Vidéo thumbnail */}
          <div className="relative h-48 bg-gradient-to-br from-slate-200 to-slate-200 dark:from-slate-700 dark:to-slate-800">
            {exercise.fullVideoImageUrl && !imageError ? (
              <>
                <Image
                  alt={exercise.name}
                  className="object-cover transition-transform group-hover:scale-105"
                  fill
                  loading="lazy"
                  onError={() => setImageError(true)}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  src={exercise.fullVideoImageUrl}
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button className="bg-white/90 text-slate-900" onClick={handlePlayVideo} size="small" variant="secondary">
                    <Play className="h-4 w-4 mr-2" />
                    {t("workout_builder.exercise.watch_video")}
                  </Button>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-slate-400 dark:text-slate-500">
                  <Target className="h-12 w-12" />
                </div>
              </div>
            )}

            {/* Badge du muscle en haut à gauche */}
            <div className="absolute top-3 left-3">
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" variant="outline">
                {t(`workout_builder.muscles.${muscle.toLowerCase()}` as keyof typeof t)}
              </Badge>
            </div>

            {/* Menu d'actions en haut à droite */}
            <div className="absolute top-3 right-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="h-8 w-8 bg-white/90 hover:bg-white" size="small" variant="ghost">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onShuffle(exercise.id, muscle)}>
                    <Shuffle className="h-4 w-4 mr-2" />
                    {t("workout_builder.exercise.shuffle")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(exercise.id, muscle)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t("workout_builder.exercise.remove")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          {/* Titre de l'exercice */}
          <div className="flex items-start justify-between mb-3">
            <h4 className="font-semibold text-slate-900 dark:text-slate-200 text-sm leading-tight line-clamp-2">{exercise.name}</h4>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="h-8 w-8 ml-2 flex-shrink-0" size="small" variant="ghost">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs" side="left">
                <div className="space-y-2">
                  <p className="text-sm">{exercise.introduction}</p>
                  {mechanicsTypeValue && (
                    <p className="text-xs text-slate-500">
                      <strong>Type:</strong> {mechanicsTypeValue.map((mt) => mt.replace("_", " ")).join(", ")}
                    </p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Tags des équipements */}
          {equipmentAttributes.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {equipmentAttributes.slice(0, 2).map((equipment, index) => (
                <Badge className="text-xs px-2 py-0.5" key={index} variant="outline">
                  {equipment.replace("_", " ")}
                </Badge>
              ))}
              {equipmentAttributes.length > 2 && (
                <Badge className="text-xs px-2 py-0.5" variant="outline">
                  +{equipmentAttributes.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* Types d'entraînement */}
          {typeAttributes.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {typeAttributes.slice(0, 2).map((type, index) => (
                <Badge
                  className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100"
                  key={index}
                  variant="default"
                >
                  {type}
                </Badge>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-950"
              onClick={() => onShuffle(exercise.id, muscle)}
              size="small"
              variant="outline"
            >
              <Shuffle className="h-4 w-4 mr-1" />
              {t("workout_builder.exercise.shuffle")}
            </Button>
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => onPick(exercise.id)} size="small">
              ⭐ {t("workout_builder.exercise.pick")}
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Video Modal */}
      {exercise.fullVideoUrl && <ExerciseVideoModal exercise={exercise} onOpenChange={setShowVideo} open={showVideo} />}
    </TooltipProvider>
  );
}
