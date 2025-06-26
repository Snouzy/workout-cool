import Image from "next/image";
import { Crown } from "lucide-react";

import { Locale } from "locales/types";
import { getI18n } from "locales/server";

import { getPublicPrograms } from "../actions/get-public-programs.action";
import { ProgramCard } from "./program-card";

interface ProgramsPageProps {
  locale: Locale;
}

export async function ProgramsPage({ locale }: ProgramsPageProps) {
  const programs = await getPublicPrograms();
  const t = await getI18n();

  if (programs.length === 0) {
    return (
      <div className="flex flex-col h-full flex-1">
        <div className="flex flex-col items-center justify-center flex-1">
          <h1 className="text-lg sm:text-xl leading-tight font-bold mb-2">{t("programs.no_programs_available")}</h1>
          <p className="text-base-content/60">{t("programs.no_programs_available_description")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#4F8EF7] to-[#25CB78] p-4 sm:p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg sm:text-xl leading-tight font-bold mb-2">{t("programs.workout_programs")}</h1>
            <p className="text-white/90 text-sm">{t("programs.workout_programs_description")}</p>
          </div>
          <div className="w-14 h-14 sm:w-16 sm:h-16 relative">
            <Image
              alt="Mascotte WorkoutCool"
              className="object-contain h-14 w-14 sm:h-16 sm:w-16"
              height={64}
              src="/images/emojis/WorkoutCoolHappy.png"
              width={64}
            />
          </div>
        </div>
      </div>

      <div className="overflow-auto p-4 space-y-6">
        {/* Premium Programs Section */}
        {programs.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Crown className="text-yellow-500" size={24} />
              <h3 className="text-xl font-bold text-base-content dark:text-gray-100">{t("programs.workout_programs_title")}</h3>
            </div>

            {/* Premium programs with featured layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {programs.map((program, index) => (
                <ProgramCard featured={index === 0} key={program.id} locale={locale} program={program} size="large" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
