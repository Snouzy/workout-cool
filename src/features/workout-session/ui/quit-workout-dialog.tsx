"use client";

import { AlertTriangle, Trash2 } from "lucide-react";

import { useI18n } from "locales/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface QuitWorkoutDialogProps {
  isOpen: boolean;
  onClose: VoidFunction;
  onQuitWithoutSave: VoidFunction;
  exercisesCompleted: number;
  totalExercises: number;
}

export function QuitWorkoutDialog({ isOpen, onClose, onQuitWithoutSave, exercisesCompleted, totalExercises }: QuitWorkoutDialogProps) {
  const t = useI18n();

  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent className="max-w-md bg-slate-900/95 border-slate-700/50 backdrop-blur-md">
        <DialogHeader className="pb-6">
          <DialogTitle className="flex items-center gap-3 text-xl font-bold text-white">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-500/20">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
            </div>
            {t("workout_builder.session.quit_workout_title")}
          </DialogTitle>
        </DialogHeader>

        {/* Progress Summary */}
        <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">{t("workout_builder.session.progress")}</span>
              <span className="font-bold text-white">
                {exercisesCompleted} / {totalExercises}
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-300"
                style={{ width: `${(exercisesCompleted / totalExercises) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Warning Message */}
        <div className="text-center mb-6">
          <p className="text-slate-300 leading-relaxed">{t("workout_builder.session.quit_warning")}</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Quit without saving */}
          <Button
            className="w-full bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500"
            onClick={onQuitWithoutSave}
            size="large"
            variant="default"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {t("workout_builder.session.quit_without_save")}
          </Button>

          {/* Cancel */}
          <Button className="w-full text-slate-400 hover:text-white hover:bg-slate-800" onClick={onClose} size="large" variant="ghost">
            {t("workout_builder.session.continue_workout")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
