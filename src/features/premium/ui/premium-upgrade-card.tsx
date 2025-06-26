"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Crown, ChevronRight, Star, Zap, TrendingUp, Heart, Sparkles } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { useI18n } from "locales/client";
import { useIsPremium } from "@/shared/lib/premium/use-premium";
import { Button } from "@/components/ui/button";

import type { PremiumPlan, CheckoutResult } from "@/shared/types/premium.types";

/**
 * Premium Upgrade Card - KISS approach
 *
 * Simple card component to show premium plans and handle upgrades
 * Type-safe and easy to understand
 */
export function PremiumUpgradeCard() {
  const t = useI18n();
  const router = useRouter();
  const isPremium = useIsPremium();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // Fetch available plans
  const { data: plans = [], isLoading: plansLoading } = useQuery({
    queryKey: ["premium-plans"],
    queryFn: async (): Promise<PremiumPlan[]> => {
      const response = await fetch("/api/premium/plans");
      if (!response.ok) throw new Error("Failed to fetch plans");
      return response.json();
    },
  });

  // Create checkout mutation
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
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-yellow-500/10 dark:from-blue-600/20 dark:via-purple-600/20 dark:to-yellow-600/20 rounded-3xl p-8 border border-blue-200/50 dark:border-blue-700/50">
        <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
          <Image alt="Premium mascot" height={128} src="/images/emojis/WorkoutCoolRich.png" width={128} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 dark:from-yellow-400 dark:to-orange-400 bg-clip-text text-transparent">
              Premium Active
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">You have full access to all premium features</p>
          <Button
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200"
            onClick={() => router.push("/profile")}
            variant="outline"
          >
            Manage Subscription
            <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  if (plansLoading) {
    return (
      <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50">
        <div className="animate-pulse">
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl mb-6 w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-xl mb-8 w-2/3 mx-auto"></div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative space-y-8">
      <div className="text-center space-y-4 mb-12">
        <div className="relative inline-block">
          <Image alt="Support mascot" className="mx-auto mb-4" height={80} src="/images/emojis/WorkoutCoolLove.png" width={80} />
          <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-500 animate-pulse" />
        </div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
          Upgrade to Premium
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Unlock all features and support the development of Workout.cool
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Heart className="w-4 h-4 text-red-500" />
          <span>Support the open-source mission</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
        {plans.map((plan) => {
          const isYearly = plan.priceYearly > 0;
          const price = isYearly ? plan.priceYearly : plan.priceMonthly;
          const period = isYearly ? "year" : "month";
          const savings = isYearly ? Math.round((1 - plan.priceYearly / 12 / plan.priceMonthly) * 100) : 0;
          const isLoading = checkoutMutation.isPending && selectedPlan === plan.id;

          return (
            <div
              className={`relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl p-8 border transition-all duration-300 transform hover:scale-[1.02] ${
                isYearly
                  ? "border-gradient-to-r from-green-400/50 to-blue-400/50 dark:from-green-600/50 dark:to-blue-600/50 shadow-xl"
                  : "border-gray-200/50 dark:border-gray-700/50 hover:border-blue-400/50 dark:hover:border-blue-600/50"
              }`}
              key={plan.id}
            >
              <div className="text-center space-y-4 mb-8">
                <div className="flex items-center justify-center gap-2">
                  {isYearly ? (
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center">
                      <Crown className="w-6 h-6 text-white" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{isYearly ? "Annual Plan" : "Monthly Plan"}</h3>
                <div className="space-y-1">
                  <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                    €{price}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">per {period}</div>
                  {isYearly && (
                    <div className="text-sm text-green-600 dark:text-green-400 font-medium">Only €{(price / 12).toFixed(2)}/month !!</div>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Star className="w-3 h-3 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Access to all workout programs</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <TrendingUp className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Advanced progress tracking</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Personalized workout recommendations</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Zap className="w-3 h-3 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Priority support</span>
                </li>
                {isYearly && (
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Heart className="w-3 h-3 text-red-500" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Best value - save 40%</span>
                  </li>
                )}
              </ul>

              <Button
                className={`w-full h-12 text-base font-medium transition-all duration-200 ${
                  isYearly
                    ? "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-lg"
                    : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                }`}
                disabled={isLoading}
                onClick={() => handleUpgrade(plan.id)}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Loading...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    Choose Plan
                    <ChevronRight className="w-5 h-5" />
                  </div>
                )}
              </Button>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-12 space-y-4">
        <Image alt="Happy mascot" className="mx-auto opacity-60" height={60} src="/images/emojis/WorkoutCoolHappy.png" width={60} />
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Core features will always remain free • Self-hosting available • MIT license
        </p>
      </div>
    </div>
  );
}
