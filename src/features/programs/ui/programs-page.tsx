import Image from "next/image";
import { Crown, TrendingUp } from "lucide-react";

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
    <main className="flex flex-col">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-[#4F8EF7] to-[#25CB78] p-4 sm:p-6 text-white relative">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-lg sm:text-xl leading-tight font-bold">{t("programs.workout_programs")}</h1>
              <span className="bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold animate-pulse">{t("commons.new")}</span>
            </div>
            <p className="text-white/90 text-sm mb-3">{t("programs.workout_programs_description")}</p>
          </div>
          <div className="w-14 h-14 sm:w-16 sm:h-16 relative">
            <Image
              alt="Mascotte WorkoutCool"
              className="object-contain h-14 w-14 sm:h-16 sm:w-16"
              height={64}
              priority
              src="/images/emojis/WorkoutCoolHappy.png"
              width={64}
            />
            <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
              <Crown className="text-black" size={12} />
            </div>
          </div>
        </div>
      </header>

      <section className="overflow-auto p-4 space-y-6">
        {/* Premium Programs Section */}
        {programs.length > 0 && (
          <div>
            <h2 className="sr-only">{t("programs.available_programs")}</h2>
            {/* Premium programs with featured layout */}
            <div aria-label={t("programs.workout_programs")} className="grid grid-cols-1 md:grid-cols-3 gap-4" role="list">
              {programs.map((program, index) => (
                <article className="relative" key={program.id} role="listitem">
                  <ProgramCard featured={index === 0} locale={locale} program={program} size="large" />
                </article>
              ))}
            </div>

            {/* Coming Soon Teaser */}
            <aside className="mt-6 bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp aria-hidden="true" className="text-[#4F8EF7]" size={20} />
                <h3 className="font-bold text-gray-900 dark:text-white">{t("programs.more_programs_coming_title")}</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{t("programs.more_programs_coming_description")}</p>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="bg-[#4F8EF7]/10 text-[#4F8EF7] px-2 py-1 rounded-full">{t("programs.coming_strength")}</span>
                <span className="bg-[#25CB78]/10 text-[#25CB78] px-2 py-1 rounded-full">{t("programs.coming_cardio")}</span>
                <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-1 rounded-full">
                  {t("programs.coming_yoga")}
                </span>
              </div>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
