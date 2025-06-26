"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">✓</span>
          </div>
          <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-200">{t("programs.premium_active")}</h3>
        </div>
        <p className="text-yellow-700 dark:text-yellow-300 mb-4">{t("programs.premium_active_description")}</p>
        <Button className="border-yellow-300 text-yellow-800 hover:bg-yellow-100" onClick={() => router.push("/profile")} variant="outline">
          {t("programs.manage_subscription")}
        </Button>
      </div>
    );
  }

  if (plansLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-600 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">{t("programs.upgrade_to_premium")}</h2>
        <p className="text-gray-600 dark:text-gray-400">{t("programs.premium_upgrade_description")}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {plans.map((plan) => {
          const isYearly = plan.priceYearly > 0;
          const price = isYearly ? plan.priceYearly : plan.priceMonthly;
          const period = isYearly ? "year" : "month";
          const savings = isYearly ? Math.round((1 - plan.priceYearly / 12 / plan.priceMonthly) * 100) : 0;
          const isLoading = checkoutMutation.isPending && selectedPlan === plan.id;

          return (
            <div
              className={`relative bg-white dark:bg-gray-800 rounded-xl p-6 border-2 transition-all ${
                isYearly
                  ? "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
              }`}
              key={plan.id}
            >
              {isYearly && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">Save {savings}%</span>
                </div>
              )}

              <div className="text-center mb-4">
                <h3 className="text-xl font-bold mb-2">{isYearly ? t("programs.premium_yearly") : t("programs.premium_monthly")}</h3>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  €{price}
                  <span className="text-sm font-normal text-gray-500">/{period}</span>
                </div>
                {isYearly && <div className="text-sm text-gray-500 mt-1">€{(price / 12).toFixed(2)}/month</div>}
              </div>

              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-green-500 text-sm">✓</span>
                  <span className="text-sm">{t("programs.feature_all_programs")}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500 text-sm">✓</span>
                  <span className="text-sm">{t("programs.feature_advanced_tracking")}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500 text-sm">✓</span>
                  <span className="text-sm">{t("programs.feature_recommendations")}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500 text-sm">✓</span>
                  <span className="text-sm">{t("programs.feature_priority_support")}</span>
                </li>
                {isYearly && (
                  <li className="flex items-center gap-2">
                    <span className="text-green-500 text-sm">✓</span>
                    <span className="text-sm">{t("programs.feature_save_yearly")}</span>
                  </li>
                )}
              </ul>

              <Button
                className={`w-full ${isYearly ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}`}
                disabled={isLoading}
                onClick={() => handleUpgrade(plan.id)}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {t("commons.loading")}
                  </div>
                ) : (
                  t("programs.choose_plan")
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
