"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";

import { ExerciseForStatistics } from "@/shared/types/statistics.types";
import { usePremiumStatus } from "@/shared/lib/premium/use-premium";
import { ExerciseStatisticsTab } from "@/features/statistics/components/ExerciseStatisticsTab";
import { ExercisesBrowser } from "@/features/statistics/components/ExercisesBrowser";
import { PremiumGate } from "@/components/ui/premium-gate";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ExercisesPage() {
  const [selectedExercise, setSelectedExercise] = useState<ExerciseForStatistics | null>(null);
  const isPremium = usePremiumStatus().data?.isPremium;

  const handleExerciseSelect = (exercise: ExerciseForStatistics) => {
    setSelectedExercise(exercise);
  };

  const handleBack = () => {
    setSelectedExercise(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {selectedExercise ? (
        <div className="space-y-6">
          {/* Header with back button */}
          <div className="flex items-center gap-4">
            <Button onClick={handleBack} size="sm" variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{selectedExercise.name}</h1>
              <p className="text-gray-600">Statistiques de performance</p>
            </div>
          </div>

          {/* Statistics Content */}
          {isPremium ? (
            <ExerciseStatisticsTab exerciseId={selectedExercise.id} exerciseName={selectedExercise.name} />
          ) : (
            <PremiumGate
              benefits={[
                "Suivi de la progression du poids",
                "Estimation du 1RM (répétition maximale)",
                "Analyse du volume d'entraînement",
                "Graphiques détaillés sur différentes périodes",
              ]}
              description="Accédez aux statistiques détaillées de vos exercices, incluant la progression de poids, l'estimation de 1RM, et l'analyse de volume."
              feature="exercise-statistics"
              title="Statistiques d'exercices"
            />
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Exercices</h1>
            <p className="text-gray-600">Sélectionnez un exercice pour voir ses statistiques de performance</p>
          </div>

          {/* Premium Gate for non-premium users */}
          {!isPremium && (
            <Card className="p-6">
              <PremiumGate
                benefits={[
                  "Suivi de la progression du poids par exercice",
                  "Calcul automatique de l'estimation 1RM",
                  "Analyse du volume d'entraînement hebdomadaire",
                  "Graphiques interactifs sur 4 semaines à 1 an",
                ]}
                description="Débloquez des analyses détaillées de vos performances pour chaque exercice."
                feature="exercise-statistics"
                showUpgradeButton={true}
                title="Statistiques d'exercices Premium"
              />
            </Card>
          )}

          {/* Exercise Browser */}
          <ExercisesBrowser onExerciseSelect={handleExerciseSelect} />
        </div>
      )}
    </div>
  );
}
