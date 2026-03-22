"use client";

import { Drawer } from "vaul";
import { ReactNode } from "react";
import { ExternalLink, Globe, MapPin, Monitor, PieChart, Smartphone, Sparkles, Target, TrendingUp, X } from "lucide-react";

import { useI18n } from "locales/client";
import { env } from "@/env";

import { audienceStats } from "./sponsor-config";

interface SponsorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function StatCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-3">
      <div className="flex items-center gap-1.5 mb-1">
        {icon}
        <span className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</span>
      </div>
      <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{value}</p>
    </div>
  );
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
            <Drawer.Title className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
              <Sparkles className="w-5 h-5 text-[#4F8EF7]" />
              {t("ads.dialog_title")}
            </Drawer.Title>
            <Drawer.Description className="text-sm text-slate-500 dark:text-slate-400 -mt-2">
              {t("ads.dialog_description")}
            </Drawer.Description>

            {/* Total Visits & Device Distribution */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <TrendingUp className="w-4 h-4 text-[#4F8EF7]" />
                  <span className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Total visits (feb. 2026)</span>
                </div>
                <p className="font-semibold text-lg text-slate-800 dark:text-slate-200">{audienceStats.totalVisits}</p>
                <p className="text-xs text-emerald-500 font-medium">↑{audienceStats.totalVisitsGrowth} from last month</p>
              </div>
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <PieChart className="w-4 h-4 text-[#25CB78]" />
                  <span className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Page views (feb. 2026)</span>
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
                <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Desktop {audienceStats.deviceDesktop}</span>
                  <span>Mobile {audienceStats.deviceMobile}</span>
                </div>
              </div>
            </div>

            {/* Unique Visitors & Demographics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Globe className="w-4 h-4 text-[#25CB78]" />
                  <span className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Unique visitors (feb. 2026)</span>
                </div>
                <p className="font-semibold text-lg text-slate-800 dark:text-slate-200">{audienceStats.uniqueVisitors}</p>
                <p className="text-xs text-emerald-500 font-medium">↑{audienceStats.uniqueVisitorsGrowth} from last month</p>
              </div>
              <StatCard
                icon={<Target className="w-4 h-4 text-purple-500" />}
                label={t("ads.demographics")}
                value={audienceStats.demographics}
              />
            </div>

            {/* Top Countries */}
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>
                {t("ads.top_countries")}: {audienceStats.topCountries.join(", ")}
              </span>
            </div>

            {/* SimilarWeb Traffic Map */}
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              <img alt={t("ads.similarweb_placeholder")} className="w-full h-auto" src="/images/countries.png" />
            </div>

            {/* Pricing CTA */}
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
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
