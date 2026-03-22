"use client";

import { useState } from "react";
import { ArrowRight, Megaphone } from "lucide-react";

import { useI18n } from "locales/client";
import { cn } from "@/shared/lib/utils";

import type { Sponsor } from "./sponsor-config";
import { SponsorDialog } from "./sponsor-dialog";

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
          "block rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-all hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600",
          variant === "sidebar" ? "p-3 w-full" : "p-3 w-full flex items-center gap-3",
        )}
        href={sponsor.url}
        rel="noopener noreferrer sponsored"
        target="_blank"
      >
        {variant === "sidebar" ? (
          <div className="flex flex-col items-center text-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt={sponsor.name} className="w-10 h-10 rounded-lg object-contain" src={sponsor.logoUrl} />
            <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 leading-tight">{sponsor.name}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-2">{sponsor.description}</span>
          </div>
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt={sponsor.name} className="w-8 h-8 rounded-lg object-contain shrink-0" src={sponsor.logoUrl} />
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-sm text-slate-800 dark:text-slate-200 block truncate">{sponsor.name}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 block truncate">{sponsor.description}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
          </>
        )}
      </a>
    );
  }

  return (
    <>
      <button
        className={cn(
          "rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 transition-all hover:border-slate-400 dark:hover:border-slate-500 hover:bg-white dark:hover:bg-slate-800 cursor-pointer w-full",
          variant === "sidebar" ? "p-3" : "p-3 flex items-center gap-3",
        )}
        onClick={() => setDialogOpen(true)}
        type="button"
      >
        {variant === "sidebar" ? (
          <div className="flex flex-col items-center text-center gap-1.5">
            <Megaphone className="w-8 h-8 text-slate-400 dark:text-slate-500" />
            <span className="font-semibold text-xs text-slate-600 dark:text-slate-400">{t("ads.advertise")}</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">{t("ads.click_to_advertise")}</span>
          </div>
        ) : (
          <>
            <Megaphone className="w-6 h-6 text-slate-400 dark:text-slate-500 shrink-0" />
            <div className="flex-1 min-w-0 text-left">
              <span className="font-semibold text-sm text-slate-600 dark:text-slate-400 block">{t("ads.advertise")}</span>
              <span className="text-xs text-slate-400 dark:text-slate-500 block">{t("ads.click_to_advertise")}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
          </>
        )}
      </button>
      <SponsorDialog onOpenChange={setDialogOpen} open={dialogOpen} />
    </>
  );
}
