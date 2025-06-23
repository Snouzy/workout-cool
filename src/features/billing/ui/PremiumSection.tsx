"use client";

import { useState } from "react";
import { Crown, Sparkles, Zap, Shield, ChevronRight, X } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/components/ui/button";

import { useCanAccessPremium } from "../model/useBillingStatus";
import { PremiumBadge } from "./PremiumBadge";

export function PremiumSection() {
  const { canAccess, isLoading, limits } = useCanAccessPremium();
  const [isExpanded, setIsExpanded] = useState(false);

  if (isLoading) return null;

  // Section cachée pour les utilisateurs premium
  if (!canAccess) {
    return (
      <div className="mt-8">
        <button
          className="group flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <PremiumBadge />
          <ChevronRight className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-90")} />
        </button>

        {isExpanded && (
          <div className="mt-4 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  Avantages Premium
                </h3>
                <p className="text-sm text-gray-600 mt-1">Merci de soutenir le projet !</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600" onClick={() => setIsExpanded(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 grid gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Zap className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Workouts illimités</p>
                  <p className="text-xs text-gray-600">Créez autant de séances que vous voulez</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Crown className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Exercices premium</p>
                  <p className="text-xs text-gray-600">Accès à tous les exercices de la base</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Shield className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Support prioritaire</p>
                  <p className="text-xs text-gray-600">Réponse rapide à vos questions</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-purple-200">
              <p className="text-xs text-gray-600">Votre abonnement est actif et synchronisé entre web et mobile.</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Pour les utilisateurs non-premium, on peut afficher une incitation discrète
  return (
    <div className="mt-8">
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crown className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium">Passez à Premium</p>
              <p className="text-xs text-gray-600">
                {limits?.maxWorkouts && limits.maxWorkouts > 0
                  ? `${limits.maxWorkouts} workouts restants`
                  : "Débloquez toutes les fonctionnalités"}
              </p>
            </div>
          </div>
          <Button size="small" variant="outline">
            Découvrir
          </Button>
        </div>
      </div>
    </div>
  );
}
