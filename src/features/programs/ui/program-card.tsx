import Link from "next/link";
import Image from "next/image";
import { Lock, Users, Calendar, Clock } from "lucide-react";

import { Locale } from "locales/types";
import { getI18n } from "locales/server";
import { getProgramDescription, getProgramSlug, getProgramTitle } from "@/features/programs/lib/translations-mapper";

import { PublicProgram } from "../actions/get-public-programs.action";

interface ProgramCardProps {
  program: PublicProgram;
  featured?: boolean;
  size?: "small" | "medium" | "large";
  locale: Locale;
}

export async function ProgramCard({ program, featured = false, size = "medium", locale }: ProgramCardProps) {
  const isLocked = program.isPremium;
  const t = await getI18n();
  const title = getProgramTitle(program, locale);
  const description = getProgramDescription(program, locale);
  const programSlug = getProgramSlug(program, locale);

  const heightClass = {
    small: "h-32",
    medium: "h-40",
    large: "h-48",
  }[size];

  const paddingClass = {
    small: "p-3",
    medium: "p-4",
    large: featured ? "p-6" : "p-4",
  }[size];

  const titleClass = {
    small: "text-sm font-semibold",
    medium: "text-lg font-bold",
    large: featured ? "text-xl font-bold mb-2" : "text-lg font-bold",
  }[size];

  const subtitleClass = {
    small: "text-xs",
    medium: "text-sm opacity-90",
    large: featured ? "text-sm mb-1 opacity-90" : "text-sm opacity-90",
  }[size];

  const getGradient = (level: string) => {
    switch (level) {
      case "BEGINNER":
        return "from-green-500 to-emerald-600";
      case "INTERMEDIATE":
        return "from-blue-500 to-indigo-600";
      case "ADVANCED":
        return "from-red-500 to-orange-600";
      default:
        return "from-slate-500 to-gray-600";
    }
  };

  return (
    <div className={featured ? "md:col-span-2" : ""}>
      <Link
        className={`relative block rounded-xl overflow-hidden border-2 transition-all ease-in-out ${heightClass} ${
          featured
            ? "border-[#4F8EF7]/20 hover:border-[#4F8EF7] hover:scale-[1.01]"
            : program.isPremium
              ? "border-[#25CB78]/20 hover:border-[#25CB78] hover:scale-[1.02]"
              : "border-gray-200 dark:border-gray-700 hover:border-[#4F8EF7] hover:scale-[1.02]"
        }`}
        href={`/programs/${programSlug}`}
      >
        {/* Gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(program.level)}`}></div>

        {/* Image overlay */}
        <Image alt={title} className="absolute inset-0 w-full h-full object-cover mix-blend-overlay" fill src={program.image} />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Badges */}
        <div className={`absolute ${size === "large" ? "top-4 left-4" : "top-3 left-3"} flex flex-wrap gap-2`}>
          <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
            {t(`levels.${program.level}` as keyof typeof t)}
          </span>
          {program.isPremium && (
            <span className="bg-yellow-500/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-semibold">
              {t("programs.premium")}
            </span>
          )}
        </div>

        {/* Lock/Emoji/Stats */}
        <div className={`absolute ${size === "large" ? "top-4 right-4" : "top-3 right-3"} flex flex-col items-end gap-2`}>
          {/* Lock ou emoji */}
          <div
            className={`${size === "large" ? "w-10 h-10" : "w-8 h-8"} bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center`}
          >
            {isLocked ? (
              <Lock className="text-white" size={size === "large" ? 16 : 14} />
            ) : (
              <Image
                alt="Emoji"
                className={`object-contain ${size === "large" ? "w-6 h-6" : "w-5 h-5"}`}
                height={size === "large" ? 24 : 20}
                src="/images/emojis/WorkoutCoolHappy.png"
                width={size === "large" ? 24 : 20}
              />
            )}
          </div>
        </div>

        {/* Content */}
        <div className={`absolute bottom-0 left-0 right-0 ${paddingClass} text-white`}>
          <div className="flex items-end justify-between">
            <div className="flex-1 min-w-0">
              <h4 className={`${titleClass} leading-tight truncate`}>{title}</h4>
              <p className={`${subtitleClass} truncate`}>{description}</p>

              {/* Stats compactes */}
              <div className="flex items-center gap-3 mt-1 text-xs opacity-75">
                <div className="flex items-center gap-1">
                  <Users size={12} />
                  <span>{program.totalEnrollments}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span>
                    {program.durationWeeks}
                    {t("programs.week_short")}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>
                    {program.sessionDurationMin}
                    {t("programs.min_short")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
