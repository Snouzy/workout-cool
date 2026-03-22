"use client";

import { useState } from "react";
import { ArrowRight, ExternalLink, Megaphone } from "lucide-react";

import { useI18n } from "locales/client";
import { cn } from "@/shared/lib/utils";

import { SponsorDialog } from "./sponsor-dialog";

import type { Sponsor } from "./sponsor-config";

interface SponsorCardProps {
  sponsor: Sponsor | null;
  variant?: "sidebar" | "banner";
}

export function SponsorCard({ sponsor, variant = "sidebar" }: SponsorCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const t = useI18n();

  if (sponsor) {
    return (
      <a
        className={cn(
          "group block rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-all hover:shadow-lg hover:border-[#4F8EF7]/40 dark:hover:border-[#4F8EF7]/40 hover:-translate-y-0.5",
          variant === "sidebar" ? "p-3 w-full" : "p-3 w-full flex items-center gap-3",
        )}
        href={sponsor.url}
        rel="noopener noreferrer sponsored"
        target="_blank"
      >
        {variant === "sidebar" ? (
          <div className="flex flex-col items-center text-center gap-2.5">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={sponsor.name}
                className="w-14 h-14 rounded-xl object-contain ring-2 ring-slate-100 dark:ring-slate-700 group-hover:ring-[#4F8EF7]/20 transition-all"
                src={sponsor.logoUrl}
              />
            </div>
            <div className="space-y-1">
              <span className="font-bold text-xs text-slate-800 dark:text-slate-200 leading-tight block">{sponsor.name}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-2 block">{sponsor.description}</span>
            </div>
            <span className="flex items-center gap-1 text-[10px] font-medium text-[#4F8EF7]">
              {t("ads.visit_sponsor")}
              <ExternalLink className="w-3 h-3" />
            </span>
          </div>
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt={sponsor.name} className="w-10 h-10 rounded-xl object-contain ring-2 ring-slate-100 dark:ring-slate-700 shrink-0" src={sponsor.logoUrl} />
            <div className="flex-1 min-w-0">
              <span className="font-bold text-sm text-slate-800 dark:text-slate-200 block truncate">{sponsor.name}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 block truncate">{sponsor.description}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#4F8EF7] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          </>
        )}
      </a>
    );
  }

  return (
    <>
      <button
        className={cn(
          "group rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/50 transition-all hover:border-[#4F8EF7]/50 dark:hover:border-[#4F8EF7]/50 hover:shadow-md cursor-pointer w-full",
          variant === "sidebar" ? "p-3.5" : "p-3 flex items-center gap-3",
        )}
        onClick={() => setDialogOpen(true)}
        type="button"
      >
        {variant === "sidebar" ? (
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4F8EF7]/10 to-[#25CB78]/10 dark:from-[#4F8EF7]/20 dark:to-[#25CB78]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Megaphone className="w-6 h-6 text-[#4F8EF7]" />
            </div>
            <span className="font-bold text-xs text-slate-700 dark:text-slate-300">{t("ads.advertise")}</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 leading-snug">{t("ads.click_to_advertise")}</span>
          </div>
        ) : (
          <>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F8EF7]/10 to-[#25CB78]/10 flex items-center justify-center shrink-0">
              <Megaphone className="w-5 h-5 text-[#4F8EF7]" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <span className="font-bold text-sm text-slate-700 dark:text-slate-300 block">{t("ads.advertise")}</span>
              <span className="text-xs text-slate-400 dark:text-slate-500 block">{t("ads.click_to_advertise")}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#4F8EF7] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          </>
        )}
      </button>
      <SponsorDialog onOpenChange={setDialogOpen} open={dialogOpen} />
    </>
  );
}
