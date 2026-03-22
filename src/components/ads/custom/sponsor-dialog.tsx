"use client";

import { Drawer } from "vaul";
import { ExternalLink, Globe, MapPin, Monitor, PieChart, Search, Smartphone, Sparkles, Target, TrendingUp, X } from "lucide-react";

import { useI18n } from "locales/client";
import { env } from "@/env";

import { audienceStats } from "./sponsor-config";

interface SponsorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SponsorDialog({ open, onOpenChange }: SponsorDialogProps) {
  const t = useI18n();
  const stripeUrl = env.NEXT_PUBLIC_STRIPE_AD_SPOT_URL ?? "#";

  return (
    <Drawer.Root onOpenChange={onOpenChange} open={open}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/60" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 flex max-h-[92vh] flex-col rounded-t-2xl bg-white outline-none dark:bg-slate-900 sm:mx-auto sm:max-w-lg">
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="h-1.5 w-12 shrink-0 rounded-full bg-slate-300 dark:bg-slate-600" />
          </div>

          {/* Close button */}
          <button
            className="absolute right-4 top-4 rounded-md p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            onClick={() => onOpenChange(false)}
            type="button"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Scrollable content */}
          <div className="overflow-y-auto px-5 pb-5 pt-2 space-y-4">
            {/* 1. HOOK — Pattern interrupt with authority proof */}
            <div>
              <Drawer.Title className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                <Sparkles className="w-5 h-5 text-[#4F8EF7]" />
                {t("ads.dialog_title")}
              </Drawer.Title>
              <Drawer.Description className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {t("ads.dialog_description")}
              </Drawer.Description>
            </div>

            {/* 2. AUTHORITY — #1 on search engines (pattern interrupt) */}
            <div className="rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800/50 p-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/50">
                  <Search className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{t("ads.authority_title")}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t("ads.authority_subtitle")}</p>
                </div>
              </div>
            </div>

            {/* 3. SOCIAL PROOF — Traffic stats reframed as reach */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <TrendingUp className="w-4 h-4 text-[#4F8EF7]" />
                  <span className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {t("ads.total_visits_label")}
                  </span>
                </div>
                <p className="font-semibold text-lg text-slate-800 dark:text-slate-200">{audienceStats.totalVisits}</p>
                <p className="text-xs text-emerald-500 font-medium">
                  ↑{audienceStats.totalVisitsGrowth} {t("ads.from_last_month")}
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <PieChart className="w-4 h-4 text-[#25CB78]" />
                  <span className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {t("ads.page_views_label")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Monitor className="w-3.5 h-3.5" />
                    <span>{audienceStats.desktopPageViews}</span>
                  </div>
                  <span className="text-xs text-emerald-500 font-medium">↑{audienceStats.desktopPageViewsGrowth}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-700 dark:text-slate-300 mt-1">
                  <div className="flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>{audienceStats.mobilePageViews}</span>
                  </div>
                  <span className="text-xs text-emerald-500 font-medium">↑{audienceStats.mobilePageViewsGrowth}</span>
                </div>
              </div>
            </div>

            {/* 4. SPECIFICITY — Unique visitors + device split */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Globe className="w-4 h-4 text-[#25CB78]" />
                  <span className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {t("ads.unique_visitors_label")}
                  </span>
                </div>
                <p className="font-semibold text-lg text-slate-800 dark:text-slate-200">{audienceStats.uniqueVisitors}</p>
                <p className="text-xs text-emerald-500 font-medium">
                  ↑{audienceStats.uniqueVisitorsGrowth} {t("ads.from_last_month")}
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <Smartphone className="w-4 h-4 text-[#4F8EF7]" />
                  <span className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {t("ads.device_split_label")}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <div className="flex-1 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700">
                      <div className="h-2.5 rounded-full bg-[#4F8EF7]" style={{ width: `${audienceStats.deviceDesktop}` }} />
                    </div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{audienceStats.deviceDesktop}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <div className="flex-1 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700">
                      <div className="h-2.5 rounded-full bg-[#A5C4F7]" style={{ width: `${audienceStats.deviceMobile}` }} />
                    </div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{audienceStats.deviceMobile}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. AUDIENCE QUALITY — Demographics */}
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-3 space-y-3">
              <div className="flex items-center gap-1.5">
                <Target className="w-4 h-4 text-purple-500" />
                <span className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">{t("ads.audience_quality")}</span>
              </div>

              {/* Gender */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-600 dark:text-slate-300 w-14 shrink-0">Male</span>
                  <div className="flex-1 h-3 rounded-full bg-slate-200 dark:bg-slate-700">
                    <div className="h-3 rounded-full bg-[#4F8EF7]" style={{ width: `${audienceStats.genderMale}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 w-12 text-right">
                    {audienceStats.genderMale}%
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-600 dark:text-slate-300 w-14 shrink-0">Female</span>
                  <div className="flex-1 h-3 rounded-full bg-slate-200 dark:bg-slate-700">
                    <div className="h-3 rounded-full bg-[#A5C4F7]" style={{ width: `${audienceStats.genderFemale}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 w-12 text-right">
                    {audienceStats.genderFemale}%
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700" />

              {/* Age */}
              <div className="space-y-1">
                {audienceStats.ageDistribution.map((age) => (
                  <div className="flex items-center gap-3" key={age.range}>
                    <span className="text-xs text-slate-600 dark:text-slate-300 w-14 shrink-0">{age.range}</span>
                    <div className="flex-1 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700">
                      <div className="h-2.5 rounded-full bg-[#4F8EF7]" style={{ width: `${(age.percent / 27) * 100}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 w-12 text-right">{age.percent}%</span>
                  </div>
                ))}
              </div>

              {/* Audience insight */}
              <p className="text-xs text-slate-500 dark:text-slate-400 italic">{t("ads.audience_insight")}</p>
            </div>

            {/* 6. GEOGRAPHIC REACH — Top Countries + Map */}
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>
                {t("ads.top_countries")}: {audienceStats.topCountries.join(", ")}
              </span>
            </div>
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt={t("ads.similarweb_placeholder")} className="w-full h-auto" src="/images/countries.png" />
            </div>

            {/* 8. VALUE PROP + CTA — Benefits reframed as outcomes */}
            <div className="rounded-xl bg-gradient-to-br from-[#4F8EF7] to-[#25CB78] p-5 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm opacity-80">{t("ads.pricing_starting_at")}</p>
                  <p className="text-3xl font-bold">
                    {audienceStats.pricing}
                    <span className="text-sm font-normal opacity-80">/{t("ads.month")}</span>
                  </p>
                </div>
                <Sparkles className="w-8 h-8 opacity-40" />
              </div>

              <ul className="space-y-1.5 mb-5 text-sm opacity-90">
                <li>✓ {t("ads.feature_logo_link")}</li>
                <li>✓ {t("ads.feature_visitors")}</li>
                <li>✓ {t("ads.feature_targeted")}</li>
                <li>✓ {t("ads.feature_premium_placement")}</li>
              </ul>

              <a
                className="flex items-center justify-center gap-2 w-full bg-white text-[#4F8EF7] font-semibold py-3 rounded-lg hover:bg-white/90 transition-colors"
                href={stripeUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                {t("ads.cta_book")}
                <ExternalLink className="w-4 h-4" />
              </a>

              <p className="text-center text-xs opacity-60 mt-2">{t("ads.cta_subtext")}</p>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
