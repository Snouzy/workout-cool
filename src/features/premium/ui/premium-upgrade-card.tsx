"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Crown, Zap, Heart, Dumbbell, Check, ArrowRight, Sparkles } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { useI18n } from "locales/client";
import { useIsPremium } from "@/shared/lib/premium/use-premium";
import { Button } from "@/components/ui/button";

import type { PremiumPlan, CheckoutResult } from "@/shared/types/premium.types";

export function PremiumUpgradeCard() {
  const t = useI18n();
  const router = useRouter();
  const isPremium = useIsPremium();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const { data: plans = [], isLoading: plansLoading } = useQuery({
    queryKey: ["premium-plans"],
    queryFn: async (): Promise<PremiumPlan[]> => {
      const response = await fetch("/api/premium/plans");
      if (!response.ok) throw new Error("Failed to fetch plans");
      return response.json();
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: async (planId: string): Promise<CheckoutResult> => {
      const response = await fetch("/api/premium/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      if (!response.ok) throw new Error("Failed to create checkout");
      return response.json();
    },
    onSuccess: (result) => {
      if (result.success && result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      }
    },
    onError: (error) => {
      console.error("Checkout error:", error);
      alert("Failed to create checkout. Please try again.");
    },
  });

  const handleUpgrade = (planId: string) => {
    setSelectedPlan(planId);
    checkoutMutation.mutate(planId);
  };

  if (isPremium) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-b from-[#4F8EF7]/5 to-[#25CB78]/5 dark:from-[#4F8EF7]/10 dark:to-[#25CB78]/10 rounded-3xl p-8 border border-[#4F8EF7]/20 dark:border-[#4F8EF7]/30">
        <div className="absolute -top-8 -right-8 w-48 h-48 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFD93D] to-[#FFA500] rounded-full blur-3xl" />
        </div>
        <div className="absolute top-4 right-4">
          <Image alt="Premium mascot" className="drop-shadow-lg" height={80} src="/images/emojis/WorkoutCoolRich.png" width={80} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-[#FFD93D] to-[#FFA500] rounded-2xl flex items-center justify-center">
                <Crown className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#25CB78] rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Premium Active</h3>
              <div className="flex items-center gap-2 text-sm text-[#25CB78] font-medium">
                <div className="w-2 h-2 bg-[#25CB78] rounded-full animate-pulse" />
                All features unlocked
              </div>
            </div>
          </div>
          <Button
            className="mt-6 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:scale-[1.02] hover:border-[#4F8EF7]/50 dark:hover:border-[#4F8EF7]/50 transition-all duration-200 ease-out rounded-xl h-11 px-6 font-medium"
            onClick={() => router.push("/profile")}
            variant="outline"
          >
            Manage Subscription
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative space-y-16">
      <div className="text-center space-y-4 max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">You’re already getting a lot for free...</h2>
        <p className="text-gray-700 dark:text-gray-400 text-lg leading-relaxed">
          Workout.cool is a free, open-source fitness app used daily by{" "}
          <strong className="text-gray-700 dark:text-white">70,000+ users</strong>. It’s built with love (not VC money ^^) and it costs us
          real time and money to keep it running.
        </p>
        <p className="text-gray-600 dark:text-gray-500 text-md">
          At first, we were running on donations. But as you can imagine, donations weren&apos;t sufficient to cover development and running
          costs. So we made you a package that will help us keep the lights on — and unlock a few superpowers along the way. <br /> <br />
          If Workout.cool helps you level up your health, please consider going Premium :D !
        </p>
      </div>

      <div className="text-center space-y-6 mb-16">
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FFD93D]/20 to-[#4F8EF7]/20 blur-3xl" />
          <Image
            alt="Support mascot"
            className="relative z-10 drop-shadow-2xl"
            height={100}
            src="/images/emojis/WorkoutCoolLove.png"
            width={100}
          />
          <div className="absolute -top-3 -right-3">
            <div className="relative">
              <Sparkles className="w-8 h-8 text-[#FFD93D]" />
              <div className="absolute inset-0 animate-ping">
                <Sparkles className="w-8 h-8 text-[#FFD93D] opacity-40" />
              </div>
            </div>
          </div>
        </div>

        <p className="text-xl text-gray-700 dark:text-gray-400 max-w-xl mx-auto">Unlock advanced features & support open-source fitness.</p>
        <p className="text-md text-gray-500 dark:text-gray-600 max-w-xl mx-auto !mt-1">
          <span className="text-gray-700 dark:text-gray-400 text-2xl">“</span>
          Never skimp on fitness & books — invest in yourself !<span className="text-gray-600 dark:text-gray-400 text-2xl">”</span>
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#25CB78]/10 dark:bg-[#25CB78]/20 rounded-full">
          <Heart className="w-4 h-4 text-[#25CB78]" fill="currentColor" />
          <span className="text-sm font-medium text-[#25CB78]">Support the mission</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
        {plans.map((plan) => {
          const isYearly = plan.priceYearly > 0;
          const price = isYearly ? plan.priceYearly : plan.priceMonthly;
          const period = isYearly ? "year" : "month";
          const isLoading = checkoutMutation.isPending && selectedPlan === plan.id;

          return (
            <div
              className={`relative bg-white dark:bg-gray-900 rounded-3xl p-8 border-2 transition-all duration-200 ease-out hover:scale-[1.02] hover:-translate-y-1 ${
                isYearly
                  ? "border-[#25CB78]/30 dark:border-[#25CB78]/40 shadow-xl shadow-[#25CB78]/10"
                  : "border-gray-200 dark:border-gray-800 hover:border-[#4F8EF7]/30 dark:hover:border-[#4F8EF7]/40"
              }`}
              key={plan.id}
            >
              {isYearly && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-[#25CB78] to-[#4F8EF7] text-white text-sm font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5">
                    <Zap className="w-4 h-4" />
                    BEST VALUE
                  </div>
                </div>
              )}

              <div className="text-center space-y-6 mb-8">
                <div className="inline-flex items-center justify-center">
                  {isYearly ? (
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#25CB78] to-[#4F8EF7] rounded-2xl flex items-center justify-center">
                        <Crown className="w-8 h-8 text-white" strokeWidth={2.5} />
                      </div>
                      <div className="absolute -bottom-4 -right-4 w-10 h-10 bg-[#FFD93D] rounded-xl flex items-center justify-center rotate-12">
                        <span className="text-xs font-bold text-gray-900">40% off</span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-[#4F8EF7] to-[#4F8EF7]/80 rounded-2xl flex items-center justify-center">
                      <Dumbbell className="w-8 h-8 text-white" strokeWidth={2.5} />
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{isYearly ? "Annual" : "Monthly"}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold text-gray-900 dark:text-white">€{price}</span>
                    <span className="text-lg text-gray-500 dark:text-gray-400">/{period}</span>
                  </div>
                  {isYearly && (
                    <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-[#25CB78]/10 dark:bg-[#25CB78]/20 rounded-full">
                      <div className="w-2 h-2 bg-[#25CB78] rounded-full" />
                      <span className="text-sm font-medium text-[#25CB78]">€{(price / 12).toFixed(2)}/month</span>
                    </div>
                  )}
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#4F8EF7]" />
                  All workout programs
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#4F8EF7]" />
                  Progress tracking<span className="text-xs text-gray-500 dark:text-gray-400 -ml-1 italic">(soon)</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#4F8EF7]" />
                  All future programs & updates
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#4F8EF7]" />
                  Priority support
                </li>
                {isYearly && (
                  <li className="flex items-center gap-3">
                    <Heart className="w-4 h-4 text-[#25CB78]" fill="currentColor" />
                    Save 40% yearly
                  </li>
                )}
              </ul>

              <Button
                className={`w-full h-12 text-base font-semibold transition-all duration-200 ease-out rounded-xl ${
                  isYearly
                    ? "bg-gradient-to-r from-[#25CB78] to-[#4F8EF7] hover:from-[#25CB78]/90 hover:to-[#4F8EF7]/90 text-white shadow-lg shadow-[#25CB78]/20"
                    : "bg-[#4F8EF7] hover:bg-[#4F8EF7]/90 text-white"
                } hover:scale-[1.02] active:scale-[0.98]`}
                disabled={isLoading}
                onClick={() => handleUpgrade(plan.id)}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>{isYearly ? "I want to support + save 40%" : "Let’s unlock my full plan"}</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </Button>
              <p className="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">
                {isYearly ? "Thank you for supporting." : "No pressure. You can upgrade anytime."}
              </p>
            </div>
          );
        })}
      </div>

      <div className="text-center !mt-24 space-y-6">
        <div className="relative inline-block">
          <Image alt="Happy mascot" className="mx-auto" height={60} src="/images/emojis/WorkoutCoolBiceps.png" width={60} />
          <div className="absolute -top-2 left-1/2 -translate-x-[15%] rotate-2">
            <div className="w-max px-2 h-6 bg-[#4F8EF7] rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-white">keep pushing ! huhu</span>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 px-4 sm:px-10">
            Still not sure? No worries. Workout.cool will always remain free and open-source. <br />
            But if you believe in what we’re building and you can afford it, your support will help 💚
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-500">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-[#25CB78] rounded-full" />
              <span>Self-hosting</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-[#4F8EF7] rounded-full" />
              <span>Community</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-[#FFD93D] rounded-full" />
              <span>MIT License</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
