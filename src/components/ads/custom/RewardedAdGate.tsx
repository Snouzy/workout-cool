"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import Link from "next/link";
import { AlertCircle, Crown, Dumbbell, Loader2, RotateCw, Tv, Zap } from "lucide-react";
import { useI18n } from "locales/client";

import { REWARDED_AD_TIMEOUT_MS, rewardedAdGateReducer } from "./rewarded-ad-state";

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
  const [adState, dispatch] = useReducer(rewardedAdGateReducer, { status: "idle" });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = useCallback(() => {
    if (isPremium) {
      onRewardGranted();
      return;
    }
    setOpen(true);
  }, [isPremium, onRewardGranted]);

  const clearAdTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => clearAdTimeout, [clearAdTimeout]);

  useEffect(() => {
    if (adState.status === "success") {
      setOpen(false);
      onRewardGranted();
    }
  }, [adState.status, onRewardGranted]);

  const requestAd = useCallback(() => {
    const rewardedAds = window.ezRewardedAds;

    if (!rewardedAds?.ready) {
      dispatch({ type: "failure", reason: "blocked" });
      return;
    }

    dispatch({ type: "start" });
    clearAdTimeout();
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      dispatch({ type: "timeout" });
    }, REWARDED_AD_TIMEOUT_MS);

    rewardedAds.requestAndShow((result) => {
      clearAdTimeout();

      if (result.status && result.reward) {
        dispatch({ type: "success" });
      } else {
        dispatch({ type: "failure", reason: "failed" });
      }
    });
  }, [clearAdTimeout]);

  const handleWatchAd = useCallback(() => {
    if (adState.status === "idle") requestAd();
  }, [adState.status, requestAd]);

  const handleRetry = useCallback(() => {
    if (adState.status !== "error") return;

    dispatch({ type: "retry" });
    requestAd();
  }, [adState.status, requestAd]);

  const isLoading = adState.status === "loading";
  const isError = adState.status === "error";

  return (
    <>
      <button className="flex items-center justify-center gap-2 w-full" onClick={handleClick} type="button">
        {children}
      </button>

      <Dialog
        onOpenChange={(nextOpen) => {
          if (!nextOpen) clearAdTimeout();
          setOpen(nextOpen);
        }}
        open={open}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader className="items-center text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-2 shadow-lg shadow-green-500/20">
              <Dumbbell className="w-8 h-8 text-white" />
            </div>
            <DialogTitle className="!text-center">{t("ads.rewarded_dialog_title")}</DialogTitle>
            <DialogDescription className="!text-center">{t("ads.rewarded_dialog_subtitle")}</DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            {isError ? (
              <div className="flex items-start gap-2 rounded-xl bg-red-50 dark:bg-red-950/40 p-3 text-red-700 dark:text-red-300">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p className="text-sm">{t("ads.rewarded_ad_error")}</p>
              </div>
            ) : null}

            <button
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors disabled:opacity-50"
              disabled={isLoading}
              onClick={isError ? handleRetry : handleWatchAd}
              type="button"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : isError ? <RotateCw className="w-5 h-5" /> : <Tv className="w-5 h-5" />}
              {isError ? t("ads.rewarded_ad_retry") : t("ads.rewarded_watch_ad")}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
              <span className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wide">{t("ads.rewarded_or")}</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            </div>

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
