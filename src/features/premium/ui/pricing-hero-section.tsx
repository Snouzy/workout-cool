"use client";

import Image from "next/image";
import { Sparkles, Heart, Github, Users, TrendingUp, Zap } from "lucide-react";

import { useI18n } from "locales/client";

export function PricingHeroSection() {
  const t = useI18n();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FF6B35]/5 to-[#00D4AA]/5 dark:from-[#FF6B35]/10 dark:to-[#00D4AA]/10 pt-6 pb-16 md:pt-10 md:pb-24">
      <div className="container mx-auto px-4 text-center">
        {/* Main Hero Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00D4AA]/10 dark:bg-[#00D4AA]/20 rounded-full">
            <Github className="w-4 h-4 text-[#00D4AA]" />
            <span className="text-sm font-medium text-[#00D4AA]">{t("premium.hero.badge")}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight">
            {t("premium.hero.title")}
            <span className="inline-block ml-2">💪</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-2xl text-gray-700 dark:text-gray-300 sm:leading-relaxed leading-tight max-w-3xl mx-auto">
            {t("premium.hero.subtitle")}
          </p>

          {/* Social Proof */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B35]/20 to-[#00D4AA]/20 blur-3xl opacity-50" />
            <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 md:p-8">
              <div className="flex items-center justify-center mb-6">
                <Image alt="Community mascot" className="drop-shadow-2xl" height={80} src="/images/emojis/WorkoutCoolLove.png" width={80} />
                <div className="absolute -top-2 -right-2">
                  <div className="relative">
                    <Sparkles className="w-6 h-6 text-[#FF6B35]" />
                    <div className="absolute inset-0 animate-ping">
                      <Sparkles className="w-6 h-6 text-[#FF6B35] opacity-40" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1">
                    <Users className="w-4 h-4 text-[#FF6B35]" />
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{t("premium.hero.stats.athletes.count")}</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{t("premium.hero.stats.athletes.label")}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1">
                    <TrendingUp className="w-4 h-4 text-[#00D4AA]" />
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{t("premium.hero.stats.series.count")}</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{t("premium.hero.stats.series.label")}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1">
                    <Heart className="w-4 h-4 text-[#22C55E]" fill="currentColor" />
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{t("premium.hero.stats.rating.count")}</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{t("premium.hero.stats.rating.label")}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1">
                    <Zap className="w-4 h-4 text-[#F59E0B]" />
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{t("premium.hero.stats.progression.count")}</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{t("premium.hero.stats.progression.label")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
