"use client";

import { useState } from "react";
import { ArrowRight, ExternalLink, Megaphone } from "lucide-react";
import { useI18n } from "locales/client";

import { SponsorDialog } from "./sponsor-dialog";

import type { Sponsor } from "./sponsor-config";

import { cn } from "@/shared/lib/utils";

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
          "group relative block rounded-xl border transition-all hover:shadow-lg hover:-translate-y-0.5",
          "border-[#4F8EF7]/20 dark:border-[#4F8EF7]/30 bg-gradient-to-b from-white to-blue-50/50 dark:from-slate-800 dark:to-slate-800/80 hover:border-[#4F8EF7]/40 shadow-sm",
          variant === "sidebar" ? "p-3 w-full" : "p-3 w-full flex items-center gap-3",
        )}
        href={sponsor.url}
        rel="noopener noreferrer sponsored"
        target="_blank"
      >
        {variant === "sidebar" ? (
          <div className="flex flex-col items-center text-center gap-2.5">
            <div className="relative">
              <img
                alt={sponsor.name}
                className="w-14 h-14 rounded-xl object-contain ring-2 ring-slate-100 dark:ring-slate-700 group-hover:ring-[#4F8EF7]/20 transition-all"
                src={sponsor.logoUrl}
              />
            </div>
            <div className="space-y-1">
              <span className="font-bold text-sm md:text-md text-slate-800 dark:text-slate-200 leading-tight block">{sponsor.name}</span>
              <span className="text-[10px] md:text-sm text-slate-500 dark:text-slate-400 leading-snug line-clamp-2 block">
                {t(sponsor.descriptionKey as keyof typeof t)}
              </span>
            </div>
            <ExternalLink className="absolute top-2 right-2 w-3.5 h-3.5 text-[#4F8EF7] lg:hidden" />
            <span className="hidden lg:flex items-center gap-1 text-[10px] font-medium text-[#4F8EF7]">
              {t("ads.visit_sponsor")}
              <ExternalLink className="w-3 h-3" />
            </span>
          </div>
        ) : (
          <>
            <img
              alt={sponsor.name}
              className="w-10 h-10 rounded-xl object-contain ring-2 ring-slate-100 dark:ring-slate-700 shrink-0"
              src={sponsor.logoUrl}
            />
            <div className="flex-1 min-w-0">
              <span className="font-bold text-sm text-slate-800 dark:text-slate-200 block truncate">{sponsor.name}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 block truncate">
                {t(sponsor.descriptionKey as keyof typeof t)}
              </span>
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
          "group h-full rounded-xl border border-dashed border-slate-200 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/30 transition-all hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer w-full opacity-60 hover:opacity-100",
          variant === "sidebar" ? "p-3.5" : "p-3 flex items-center gap-3",
        )}
        onClick={() => setDialogOpen(true)}
        type="button"
      >
        {variant === "sidebar" ? (
          <div className="flex flex-col items-center text-center gap-2">
            <Megaphone className="w-5 h-5 text-slate-300 dark:text-slate-600" />
            <span className="font-medium text-xs text-slate-400 dark:text-slate-500">{t("ads.click_to_advertise")}</span>
          </div>
        ) : (
          <>
            <Megaphone className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
            <span className="text-xs text-slate-400 dark:text-slate-500">{t("ads.click_to_advertise")}</span>
            <ArrowRight className="w-4 h-4 text-[#4F8EF7] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          </>
        )}
      </button>
      <SponsorDialog onOpenChange={setDialogOpen} open={dialogOpen} />
    </>
  );
}
