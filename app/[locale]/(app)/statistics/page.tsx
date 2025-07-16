"use client";

import React, { useState, useCallback } from "react";
import { BarChart3, Search } from "lucide-react";

import { useI18n } from "locales/client";
import { ExerciseCharts } from "@/features/statistics/components/ExerciseStatisticsTab";
import { ExerciseSelection } from "@/features/statistics/components/ExerciseSelection";
import { ExerciseWithAttributes } from "@/entities/exercise/types/exercise.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function StatisticsPage() {
  const t = useI18n();
  const [showExerciseSelection, setShowExerciseSelection] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseWithAttributes | null>(null);

  const handleExerciseSelect = useCallback((exercise: ExerciseWithAttributes) => {
    setSelectedExercise(exercise);
    setShowExerciseSelection(false);
  }, []);

  const handleShowSelection = useCallback(() => {
    setShowExerciseSelection(true);
  }, []);

  const handleCloseSelection = useCallback(() => {
    setShowExerciseSelection(false);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t("statistics.title") || "Statistiques"}</h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400">
          {t("statistics.description") || "Visualisez vos performances et votre progression pour chaque exercice"}
        </p>
      </div>

      {selectedExercise ? (
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  {selectedExercise.name}
                </CardTitle>
                <Button className="flex items-center gap-2" onClick={handleShowSelection} size="sm" variant="outline">
                  <Search className="h-4 w-4" />
                  Changer d'exercice
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ExerciseCharts exerciseId={selectedExercise.id} exerciseName={selectedExercise.name} timeframe={selectedTimeframe} />
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BarChart3 className="h-16 w-16 text-slate-400 mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Aucun exercice sélectionné</h2>
            <p className="text-slate-600 dark:text-slate-400 text-center mb-6 max-w-md">
              Sélectionnez un exercice pour voir ses statistiques de performance et suivre votre progression
            </p>
            <Button className="flex items-center gap-2" onClick={handleShowSelection}>
              <Search className="h-4 w-4" />
              Sélectionner un exercice
            </Button>
          </CardContent>
        </Card>
      )}

      <ExerciseSelection onOpenChange={setShowExerciseSelection} onSelectExercise={handleExerciseSelect} open={showExerciseSelection} />
    </div>
  );
}
