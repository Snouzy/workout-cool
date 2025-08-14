import Image from "next/image";
import { Crown, TrendingUp } from "lucide-react";

import { Locale } from "locales/types";
import { getI18n } from "locales/server";
import { env } from "@/env";
import { HorizontalBottomBanner, HorizontalTopBanner } from "@/components/ads";

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
      <div className="flex flex-col h-full flex-1 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="flex flex-col items-center justify-center flex-1 p-6">
          <div className="mb-6">
            <Image
              alt="Mascotte WorkoutCool triste"
              className="object-contain w-20 h-20"
              height={80}
              priority
              src="/images/emojis/WorkoutCoolCry.png"
              width={80}
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold mb-3 text-slate-800 dark:text-slate-200 text-center">
            {t("programs.no_programs_available")}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-center max-w-md">{t("programs.no_programs_available_description")}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section - Style Apple moderne */}
      {env.NEXT_PUBLIC_TOP_PROGRAMS_BANNER_AD_SLOT && <HorizontalTopBanner adSlot={env.NEXT_PUBLIC_TOP_PROGRAMS_BANNER_AD_SLOT} />}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4F8EF7] via-[#4F8EF7] to-[#25CB78]" />
        <div className="absolute inset-0 opacity-30">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          />
        </div>

        <div className="relative p-6 sm:p-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{t("programs.workout_programs")}</h1>
                <div className="relative">
                  <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg">{t("commons.new")}</span>
                  <div className="absolute -inset-1 bg-yellow-400/20 rounded-full animate-ping" />
                </div>
              </div>
              <p className="text-white/90 text-base sm:text-lg leading-relaxed max-w-lg">{t("programs.workout_programs_description")}</p>
            </div>

            <div className="relative ml-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 relative">
                <Image
                  alt="Mascotte WorkoutCool"
                  className="object-contain w-full h-full"
                  height={80}
                  priority
                  src="/images/emojis/WorkoutCoolBiceps.png"
                  width={80}
                />
                <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1.5 shadow-lg">
                  <Crown className="text-black w-3 h-3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="flex-1 p-4 sm:p-6 space-y-8">
        {/* Programs Grid */}
        {programs.length > 0 && (
          <div>
            <h2 className="sr-only">{t("programs.available_programs")}</h2>

            {/* Grille asymétrique mobile-first */}
            <div aria-label={t("programs.workout_programs")} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6" role="list">
              {programs.map((program, index) => (
                <article
                  className={"relative animate-fade-in-up"}
                  key={program.id}
                  role="listitem"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: "both",
                  }}
                >
                  <ProgramCard locale={locale} program={program} size={index === 0 ? "medium" : "medium"} />
                </article>
              ))}
            </div>

            {/* Coming Soon Section - Style plus moderne */}
            <aside className="mt-12 relative">
              <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-3 sm:p-8 text-center relative">
                <div className="absolute -top-2 -right-2 sm:top-4 sm:right-4">
                  <Image
                    alt="Mascotte WorkoutCool excitée"
                    className="object-contain w-10 h-10 sm:w-12 sm:h-12 opacity-60"
                    height={48}
                    src="/images/emojis/WorkoutCoolWooow.png"
                    width={48}
                  />
                </div>

                {env.NEXT_PUBLIC_BOTTOM_PROGRAMS_BANNER_AD_SLOT && (
                  <HorizontalBottomBanner adSlot={env.NEXT_PUBLIC_BOTTOM_PROGRAMS_BANNER_AD_SLOT} />
                )}

                <div className="flex items-center justify-center gap-3 mb-4">
                  <TrendingUp className="text-[#4F8EF7] w-6 h-6" />
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">{t("programs.more_programs_coming_title")}</h3>
                </div>

                <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto leading-relaxed">
                  {t("programs.more_programs_coming_description")}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <span className="bg-[#4F8EF7]/10 text-[#4F8EF7] px-4 py-2 rounded-full font-medium border border-[#4F8EF7]/20 transition-all duration-200 hover:bg-[#4F8EF7]/20">
                    {t("programs.coming_strength")}
                  </span>
                  <span className="bg-[#25CB78]/10 text-[#25CB78] px-4 py-2 rounded-full font-medium border border-[#25CB78]/20 transition-all duration-200 hover:bg-[#25CB78]/20">
                    {t("programs.coming_cardio")}
                  </span>
                  <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-4 py-2 rounded-full font-medium border border-purple-200 dark:border-purple-800 transition-all duration-200 hover:bg-purple-200 dark:hover:bg-purple-900/50">
                    {t("programs.coming_yoga")}
                  </span>
                </div>
              </div>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
