"use client";
import Image from "next/image";
import { Check } from "lucide-react";
import { ExerciseAttributeValueEnum } from "@prisma/client";

import { useI18n, useCurrentLocale } from "locales/client";
import { getEquipmentTranslation } from "@/shared/lib/workout-session/equipments";
import { cn } from "@/shared/lib/utils";
import { env } from "@/env";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HorizontalBottomBanner } from "@/components/ads";

import { EQUIPMENT_CONFIG } from "../model/equipment-config";

interface EquipmentSelectionProps {
  onClearEquipment: VoidFunction;
  onToggleEquipment: (equipment: ExerciseAttributeValueEnum) => void;
  selectedEquipment: ExerciseAttributeValueEnum[];
}

interface EquipmentCardProps {
  equipment: (typeof EQUIPMENT_CONFIG)[0];
  isSelected: boolean;
  onToggle: () => void;
}

function EquipmentCard({ equipment, isSelected, onToggle }: EquipmentCardProps) {
  const t = useI18n();

  const translation = getEquipmentTranslation(equipment.value, t);

  return (
    <Card
      className={cn(
        // Base styles - Chess.com inspiration
        "group relative overflow-hidden cursor-pointer",
        "bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-800 dark:to-slate-900",
        "border-2 border-slate-200 dark:border-slate-700",
        "rounded-xl shadow-sm hover:shadow-xl",
        // Transitions smooth
        "transition-all duration-300 ease-out",
        "hover:scale-[1.02] hover:-translate-y-1",
        // Selected state
        isSelected && [
          "border-emerald-400 dark:border-emerald-500",
          "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20",
          "shadow-emerald-200/50 dark:shadow-emerald-900/50 shadow-lg",
        ],
        // Hover effects
        !isSelected && "hover:border-slate-300 dark:hover:border-slate-600",
      )}
      onClick={onToggle}
    >
      <CardContent className="p-2 sm:p-4 h-auto flex flex-col justify-center items-center relative">
        <div
          className={cn(
            "absolute top-3 left-3 w-2 h-2 rounded-full transition-colors duration-200",
            isSelected ? "bg-emerald-400" : "bg-slate-300 dark:bg-slate-600",
          )}
        />

        {isSelected && (
          <div className="absolute top-2 right-2">
            <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-25" />
            <Badge
              className="relative bg-emerald-500 hover:bg-emerald-600 text-white border-0 h-6 w-6 p-0 flex items-center justify-center rounded-full"
              variant="default"
            >
              <Check className="h-3 w-3" />
            </Badge>
          </div>
        )}

        <div className="flex items-center justify-center mb-3">
          <div className={cn("relative transition-transform duration-200 group-hover:scale-110", isSelected && "scale-105")}>
            <Image
              alt={`${translation.label} illustration`}
              className="object-contain filter transition-all duration-200 group-hover:brightness-110"
              height={48}
              src={equipment.icon}
              style={{
                width: "6.25rem",
                height: "5rem",
              }}
              width={64}
            />
          </div>
        </div>

        {/* Label centré - PLUS VISIBLE MAINTENANT */}
        <div className="text-center">
          <h3
            className={cn(
              "font-semibold text-sm transition-all duration-200",
              "tracking-wide leading-tight",
              isSelected
                ? "text-emerald-700 dark:text-emerald-300"
                : "text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-200",
            )}
          >
            {translation.label}
          </h3>
        </div>

        {/* Progress bar subtile en bas */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-700 overflow-hidden rounded-b-xl">
          <div
            className={cn(
              "h-full transition-all duration-500 ease-out",
              isSelected ? "w-full bg-gradient-to-r from-emerald-400 to-emerald-500" : "w-0 group-hover:w-1/3 bg-slate-400",
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function EquipmentSelection({ onToggleEquipment, selectedEquipment }: EquipmentSelectionProps) {
  const locale = useCurrentLocale();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {EQUIPMENT_CONFIG.map((equipment, index) => (
          <div
            className="animate-fade-in-up"
            key={equipment.value}
            style={{
              animationDelay: `${index * 50}ms`,
              animationFillMode: "both",
            }}
          >
            <EquipmentCard
              equipment={equipment}
              isSelected={selectedEquipment.includes(equipment.value)}
              onToggle={() => onToggleEquipment(equipment.value)}
            />
          </div>
        ))}
      </div>
      {(env.NEXT_PUBLIC_EQUIPMENT_SELECTION_BANNER_AD_SLOT || env.NEXT_PUBLIC_EZOIC_EQUIPMENT_SELECTION_PLACEMENT_ID) && (
        <HorizontalBottomBanner
          adSlot={env.NEXT_PUBLIC_EQUIPMENT_SELECTION_BANNER_AD_SLOT}
          ezoicPlacementId={env.NEXT_PUBLIC_EZOIC_EQUIPMENT_SELECTION_PLACEMENT_ID}
        />
      )}

      {/* {locale === "fr" ? (
        <NutripureAffiliateBanner />
      ) : (
        (env.NEXT_PUBLIC_EQUIPMENT_SELECTION_BANNER_AD_SLOT || env.NEXT_PUBLIC_EZOIC_EQUIPMENT_SELECTION_PLACEMENT_ID) && (
          <HorizontalBottomBanner
            adSlot={env.NEXT_PUBLIC_EQUIPMENT_SELECTION_BANNER_AD_SLOT}
            ezoicPlacementId={env.NEXT_PUBLIC_EZOIC_EQUIPMENT_SELECTION_PLACEMENT_ID}
          />
        )
      )} */}
      {/* <ActionBar onClearEquipment={onClearEquipment} selectedCount={selectedEquipment.length} /> */}
    </div>
  );
}
