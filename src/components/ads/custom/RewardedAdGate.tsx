"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { Crown, Dumbbell, Loader2, Tv, Zap } from "lucide-react";
import { useI18n } from "locales/client";

import { useIsPremium } from "@/shared/lib/premium/use-premium";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

declare global {
  interface Window {
    ezRewardedAds?: {
      ready: boolean;
      cmd: Array<() => void>;
      requestAndShow: (callback: (result: { status: boolean; reward: boolean; msg: string }) => void) => void;
    };
  }
}

interface RewardedAdGateProps {
  onRewardGranted: () => void;
  children: React.ReactNode;
}

export function RewardedAdGate({ onRewardGranted, children }: RewardedAdGateProps) {
  const t = useI18n();
  const isPremium = useIsPremium();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(() => {
    if (isPremium) {
      onRewardGranted();
      return;
    }
    setOpen(true);
  }, [isPremium, onRewardGranted]);

  const handleWatchAd = useCallback(() => {
    if (!window.ezRewardedAds?.ready) {
      setOpen(false);
      onRewardGranted();
      return;
    }

    setLoading(true);

    window.ezRewardedAds.requestAndShow((result) => {
      setLoading(false);
      setOpen(false);

      if (result.reward || !result.status) {
        onRewardGranted();
      }
    });
  }, [onRewardGranted]);

  return (
    <>
      <button className="flex items-center justify-center gap-2 w-full" onClick={handleClick} type="button">
        {children}
      </button>

      <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent className="max-w-sm">
          <DialogHeader className="items-center text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-2 shadow-lg shadow-green-500/20">
              <Dumbbell className="w-8 h-8 text-white" />
            </div>
            <DialogTitle className="!text-center">{t("ads.rewarded_dialog_title")}</DialogTitle>
            <DialogDescription className="!text-center">{t("ads.rewarded_dialog_subtitle")}</DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            {/* Watch Ad — primary action */}
            <button
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors disabled:opacity-50"
              disabled={loading}
              onClick={handleWatchAd}
              type="button"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Tv className="w-5 h-5" />}
              {t("ads.rewarded_watch_ad")}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
              <span className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wide">{t("ads.rewarded_or")}</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            </div>

            {/* Premium upsell */}
            <Link
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold transition-all shadow-lg shadow-amber-500/20"
              href="/premium"
              onClick={() => setOpen(false)}
            >
              <Crown className="w-5 h-5" />
              {t("ads.rewarded_go_premium")}
            </Link>

            <p className="text-center text-[11px] text-slate-400 dark:text-slate-500">
              <Zap className="w-3 h-3 inline-block mr-0.5 -mt-0.5" />
              {t("ads.rewarded_premium_hint")}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
