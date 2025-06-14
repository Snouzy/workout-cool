import Image from "next/image";
import { Check, Zap } from "lucide-react";
import { ExerciseAttributeValueEnum } from "@prisma/client";

import { useI18n } from "locales/client";
import { cn } from "@/shared/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

  // Obtenir la traduction pour l'équipement
  const getEquipmentTranslation = (value: ExerciseAttributeValueEnum) => {
    const equipmentKeys: Partial<Record<ExerciseAttributeValueEnum, string>> = {
      [ExerciseAttributeValueEnum.BODY_ONLY]: "bodyweight",
      [ExerciseAttributeValueEnum.DUMBBELL]: "dumbbell",
      [ExerciseAttributeValueEnum.BARBELL]: "barbell",
      [ExerciseAttributeValueEnum.KETTLEBELLS]: "kettlebell",
      [ExerciseAttributeValueEnum.BANDS]: "band",
      [ExerciseAttributeValueEnum.WEIGHT_PLATE]: "plate",
      [ExerciseAttributeValueEnum.PULLUP_BAR]: "pullup_bar",
      [ExerciseAttributeValueEnum.BENCH]: "bench",
    };

    const key = equipmentKeys[value];
    return {
      label: t(`workout_builder.equipment.${key}.label` as keyof typeof t),
      description: t(`workout_builder.equipment.${key}.description` as keyof typeof t),
    };
  };

  const translation = getEquipmentTranslation(equipment.value);

  return (
    <Card
      className={cn(
        // Base styles - Chess.com inspiration
        "group relative overflow-hidden cursor-pointer",
        "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900",
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
      <CardContent className="p-4 h-auto flex flex-col justify-center items-center relative">
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
                : "text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100",
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

function _StatsHeader({ selectedCount }: { selectedCount: number }) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const t = useI18n();

  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">{t("workout_builder.selection.choose_your_arsenal")}</h2>
          <p className="text-slate-300 text-sm">{t("workout_builder.selection.select_equipment_description")}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">{selectedCount}</div>
            <div className="text-xs text-slate-400 uppercase tracking-wide">{t("workout_builder.stats.selected")}</div>
          </div>
          <div className="w-px h-12 bg-slate-700" />
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-400">{EQUIPMENT_CONFIG.length}</div>
            <div className="text-xs text-slate-400 uppercase tracking-wide">{t("workout_builder.stats.total")}</div>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-slate-800 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500 ease-out"
          style={{ width: `${(selectedCount / EQUIPMENT_CONFIG.length) * 100}%` }}
        />
      </div>
    </div>
  );
}

function _ActionBar({ selectedCount, onClearEquipment }: { selectedCount: number; onClearEquipment: () => void }) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const t = useI18n();

  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up">
      <div className="bg-slate-900 dark:bg-slate-950 text-white px-6 py-3 rounded-full shadow-2xl border border-slate-700">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-emerald-400" />
            <span className="font-medium">
              {selectedCount}{" "}
              {selectedCount === 1 ? t("workout_builder.stats.equipment_ready") : t("workout_builder.stats.equipment_ready_plural")}
            </span>
          </div>

          <button
            className="text-slate-400 hover:text-red-400 transition-colors duration-200 text-sm font-medium"
            onClick={onClearEquipment}
          >
            {t("workout_builder.selection.clear_all")}
          </button>
        </div>
      </div>
    </div>
  );
}

export function EquipmentSelection({ onToggleEquipment, selectedEquipment }: EquipmentSelectionProps) {
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

      {/* <ActionBar onClearEquipment={onClearEquipment} selectedCount={selectedEquipment.length} /> */}
    </div>
  );
}
