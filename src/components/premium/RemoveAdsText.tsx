"use client";

import { useRouter } from "next/navigation";
import { Ban } from "lucide-react";

import { useI18n } from "locales/client";

export function RemoveAdsText() {
  const router = useRouter();
  const t = useI18n();

  const handleClick = () => {
    router.push("/premium");
  };

  return (
    <button
      className="flex items-center gap-0 text-[11px] sm:text-xs md:font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-full transition-all duration-200 hover:scale-105 whitespace-nowrap hover:underline"
      onClick={handleClick}
    >
      <Ban className="w-3 h-3 flex-shrink-0 mr-1" />
      <span className="whitespace-nowrap">{t("commons.remove_ads")}</span>
    </button>
  );
}
