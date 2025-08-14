import Link from "next/link";
import Image from "next/image";
import { Lock, Star, Clock, Calendar, Dumbbell } from "lucide-react";
import { ExerciseAttributeValueEnum } from "@prisma/client";

import { Locale } from "locales/types";
import { getI18n } from "locales/server";
import { getAttributeValueLabel } from "@/shared/lib/attribute-value-translation";
import { getProgramDescription, getProgramSlug, getProgramTitle } from "@/features/programs/lib/translations-mapper";

import { PublicProgram } from "../actions/get-public-programs.action";

interface ProgramCardProps {
  program: PublicProgram;
  size?: "small" | "medium" | "large";
  locale: Locale;
}

export async function ProgramCard({ program, size = "medium", locale }: ProgramCardProps) {
  const isLocked = program.isPremium;
  const t = await getI18n();
  const title = getProgramTitle(program, locale);
  const description = getProgramDescription(program, locale);
  const programSlug = getProgramSlug(program, locale);

  const paddingClass = {
    small: "p-3 sm:p-4",
    medium: "p-4 sm:p-5",
    large: "p-4 sm:p-6",
  }[size];

  const titleClass = {
    small: "text-base font-bold",
    medium: "text-lg font-bold",
    large: "text-xl font-bold",
  }[size];

  const subtitleClass = {
    small: "text-sm",
    medium: "text-sm",
    large: "text-base",
  }[size];

  const getLevelConfig = (level: string) => {
    switch (level) {
      case "BEGINNER":
        return {
          gradient: "from-[#25CB78] to-emerald-500",
          emoji: "/images/emojis/WorkoutCoolHappy.png",
          color: "text-emerald-800 dark:text-emerald-200",
          bgColor: "bg-emerald-100/90 dark:bg-emerald-900/80",
          borderColor: "border-emerald-200/60 dark:border-emerald-700/60",
        };
      case "INTERMEDIATE":
        return {
          gradient: "from-[#4F8EF7] to-blue-500",
          emoji: "/images/emojis/WorkoutCoolBiceps.png",
          color: "text-blue-800 dark:text-blue-200",
          bgColor: "bg-blue-100/90 dark:bg-blue-900/80",
          borderColor: "border-blue-200/60 dark:border-blue-700/60",
        };
      case "ADVANCED":
        return {
          gradient: "from-orange-500 to-red-500",
          emoji: "/images/emojis/WorkoutCoolSwag.png",
          color: "text-orange-800 dark:text-orange-200",
          bgColor: "bg-orange-100/90 dark:bg-orange-900/80",
          borderColor: "border-orange-200/60 dark:border-orange-700/60",
        };
      default:
        return {
          gradient: "from-slate-500 to-gray-600",
          emoji: "/images/emojis/WorkoutCoolHappy.png",
          color: "text-slate-800 dark:text-slate-200",
          bgColor: "bg-slate-100/90 dark:bg-slate-900/80",
          borderColor: "border-slate-200/60 dark:border-slate-700/60",
        };
    }
  };

  const levelConfig = getLevelConfig(program.level);

  return (
    <div className="group">
      <Link
        aria-label={`${title} - ${t(`levels.${program.level}` as keyof typeof t)} program`}
        className={`
          block rounded-2xl overflow-hidden transition-all duration-300 ease-out
          bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900
          border-2 ${levelConfig.borderColor} hover:border-opacity-60
          shadow-sm hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50
          hover:scale-[1.02] hover:-translate-y-1
        `}
        href={`/programs/${programSlug}`}
        itemScope
        itemType="https://schema.org/Course"
      >
        {/* Gradient Accent */}
        <div className={`h-1 bg-gradient-to-r ${levelConfig.gradient}`} />

        {/* Image Section */}
        <div className="relative h-32 sm:h-36 overflow-hidden">
          <Image alt={title} className="w-full h-full object-cover" fill loading="lazy" src={program.image} />
          {/* Overlay pour lisibilité */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Header avec badges sur l'image */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
            <div className="flex flex-wrap gap-2">
              <span
                className={`
                ${levelConfig.bgColor} ${levelConfig.color} 
                px-2 py-1 sm:px-3 rounded-full text-xs font-semibold
                border ${levelConfig.borderColor}
                bg-opacity-90 backdrop-blur-sm shadow-sm
              `}
              >
                {t(`levels.${program.level}` as keyof typeof t)}
              </span>
              {isLocked && (
                <span className="bg-yellow-400/90 text-yellow-900 px-2 py-1 sm:px-3 rounded-full text-xs font-semibold border border-yellow-400/40 backdrop-blur-sm shadow-sm">
                  Premium
                </span>
              )}
            </div>

            {/* Emoji/Lock */}
            <div className="relative">
              <div
                className={`
                w-8 h-8 
                bg-white/90 dark:bg-slate-800/90 rounded-full flex items-center justify-center
                shadow-sm border border-white/20 backdrop-blur-sm
                group-hover:scale-110 transition-transform duration-200
              `}
              >
                {isLocked ? (
                  <Lock className="text-slate-600 dark:text-slate-400" size={size === "large" ? 16 : 14} />
                ) : (
                  <Image
                    alt="Emoji"
                    className={"object-contain w-6 h-6"}
                    height={size === "large" ? 24 : 20}
                    loading="lazy"
                    src={levelConfig.emoji}
                    width={size === "large" ? 24 : 20}
                  />
                )}
              </div>
              {!isLocked && <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#25CB78] rounded-full animate-pulse" />}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className={`${paddingClass} space-y-3`}>
          {/* Titre et description */}
          <div>
            <h4
              className={`${titleClass} leading-tight mb-1 text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors`}
              itemProp="name"
            >
              {title}
            </h4>
            <p className={`${subtitleClass} text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2`} itemProp="description">
              {description}
            </p>
          </div>

          {/* Quick stats */}
          <div className="flex items-center gap-3 sm:gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>
                {program.durationWeeks} {t("programs.week_short").toLocaleLowerCase()}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>
                {program.sessionDurationMin} {t("programs.min_short").toLocaleLowerCase()}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              <span>
                {program.sessionsPerWeek}x/{t("programs.week_short").toLocaleLowerCase()}
              </span>
            </div>
          </div>

          {/* Equipment */}
          {program.equipment && program.equipment.length > 0 && (
            <div className="flex items-start gap-2">
              <Dumbbell className="w-3 h-3 mt-0.5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
              <div className="flex flex-wrap gap-1 text-xs text-slate-500 dark:text-slate-400">
                {program.equipment.slice(0, 3).map((equipment, index) => (
                  <span className="inline-flex items-center" key={equipment}>
                    {getAttributeValueLabel(equipment as ExerciseAttributeValueEnum, t)}
                    {index < Math.min(program.equipment.length, 3) - 1 && (
                      <span className="text-slate-300 dark:text-slate-600 ml-1">•</span>
                    )}
                  </span>
                ))}
                {program.equipment.length > 3 && (
                  <span className="text-slate-400 dark:text-slate-500">+{program.equipment.length - 3}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
