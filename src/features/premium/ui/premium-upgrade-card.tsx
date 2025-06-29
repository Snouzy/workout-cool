"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Crown, Zap, Heart, Check, ArrowRight, LogIn, Github, Users } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { useI18n, useCurrentLocale } from "locales/client";
import { usePremiumRedirect } from "@/shared/lib/premium/use-premium-redirect";
import { useIsPremium } from "@/shared/lib/premium/use-premium";
import { usePendingCheckout } from "@/shared/lib/premium/use-pending-checkout";
import { useSession } from "@/features/auth/lib/auth-client";
import { Button } from "@/components/ui/button";

import { PricingHeroSection } from "./pricing-hero-section";
import { PricingFAQ } from "./pricing-faq";
import { FeatureComparisonTable } from "./feature-comparison-table";
import { ConversionFlowNotification } from "./conversion-flow-notification";

import type { PremiumPlan, CheckoutResult } from "@/shared/types/premium.types";

export function PremiumUpgradeCard() {
  const t = useI18n();
  const locale = useCurrentLocale();
  const router = useRouter();
  const isPremium = useIsPremium();
  const { data: session, isPending: isAuthLoading } = useSession();
  const isAuthenticated = !!session?.user;

  const { storePendingCheckout, getPendingCheckout, clearPendingCheckout } = usePendingCheckout();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isYearly, setIsYearly] = useState(false);

  // Handle premium redirects after successful upgrade
  usePremiumRedirect();

  const { data: plans = [] } = useQuery({
    queryKey: ["premium-plans"],
    queryFn: async (): Promise<PremiumPlan[]> => {
      const response = await fetch("/api/premium/plans");
      if (!response.ok) throw new Error("Failed to fetch plans");
      return response.json();
    },
  });

  // Check for pending checkout after authentication
  useEffect(() => {
    if (isAuthenticated && !isAuthLoading) {
      const pendingCheckout = getPendingCheckout();
      if (pendingCheckout) {
        // Auto-trigger checkout for the pending plan
        clearPendingCheckout();
        handleCheckout(pendingCheckout.planId);
      }
    }
  }, [isAuthenticated, isAuthLoading, getPendingCheckout, clearPendingCheckout]);

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
      alert(t("premium.checkout_error"));
    },
  });

  const handleCheckout = (planId: string) => {
    setSelectedPlan(planId);
    checkoutMutation.mutate(planId);
  };

  const handleUpgrade = (planId: string) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Store the selected plan for after authentication
      storePendingCheckout(planId);

      // Redirect to sign-in with return URL to premium page
      const returnUrl = `/${locale}/premium`;
      router.push(`/auth/signin?redirect=${encodeURIComponent(returnUrl)}`);
      return;
    }

    // User is authenticated, proceed with checkout
    handleCheckout(planId);
  };

  // Get current pricing based on toggle
  const monthlyPrice = 7.9;
  const yearlyPrice = 49.0;
  const currentPrice = isYearly ? yearlyPrice : monthlyPrice;
  const currentPeriod = isYearly ? "year" : "month";
  const currentPlanId = isYearly ? "premium-yearly" : "premium-monthly";
  const monthlyEquivalent = yearlyPrice / 12;

  if (isPremium) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-b from-[#FF6B35]/5 to-[#00D4AA]/5 dark:from-[#FF6B35]/10 dark:to-[#00D4AA]/10 rounded-3xl p-8 border border-[#FF6B35]/20 dark:border-[#FF6B35]/30">
        <div className="absolute -top-8 -right-8 w-48 h-48 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35] to-[#00D4AA] rounded-full blur-3xl" />
        </div>
        <div className="absolute top-4 right-4">
          <Image alt="Premium mascot" className="drop-shadow-lg" height={80} src="/images/emojis/WorkoutCoolLove.png" width={80} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-[#FF6B35] to-[#00D4AA] rounded-2xl flex items-center justify-center">
                <Crown className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#22C55E] rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Premium Active! 💪</h3>
              <div className="flex items-center gap-2 text-sm text-[#22C55E] font-medium">
                <div className="w-2 h-2 bg-[#22C55E] rounded-full animate-pulse" />
                Supporting the mission
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <ConversionFlowNotification />

      {/* Hero Section */}
      <PricingHeroSection />

      {/* Mission-Driven Urgency Banner */}
      <section className="bg-gradient-to-r from-[#FF6B35]/10 to-[#00D4AA]/10 border-y border-[#FF6B35]/20 dark:border-[#FF6B35]/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#22C55E]" fill="currentColor" />
              <span className="text-gray-700 dark:text-gray-300">
                <strong className="text-[#22C55E]">234</strong> supporters helping the mission
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#F59E0B]" />
              <span className="text-gray-700 dark:text-gray-300">
                <strong className="text-[#F59E0B]">Limited</strong> early access spots
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-16" data-section="plans">
        <div className="container mx-auto px-4">
          {/* Pricing Toggle */}
          <div className="flex items-center justify-center mb-12">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-1 flex items-center">
              <button
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  !isYearly
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
                onClick={() => setIsYearly(false)}
              >
                Monthly
              </button>
              <button
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 relative ${
                  isYearly
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
                onClick={() => setIsYearly(true)}
              >
                Yearly
                <span className="absolute -top-2 -right-2 bg-[#22C55E] text-white text-xs px-1.5 py-0.5 rounded-full">-48%</span>
              </button>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid gap-16 sm:gap-8 md:grid-cols-2 max-w-5xl mx-auto">
            {/* FREE PLAN */}
            <div className="relative bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 border-2 border-gray-200 dark:border-gray-800 transition-all duration-200 ease-out hover:scale-[1.02] hover:-translate-y-1 hover:border-[#22C55E]/30">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-max">
                <div className="bg-[#22C55E] text-white text-sm font-bold px-4 py-1.5 rounded-full">Open-Source • Always Free</div>
              </div>

              <div className="text-center space-y-6 mb-8 mt-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#22C55E] to-[#16A34A] rounded-2xl flex items-center justify-center mx-auto">
                  <Github className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">FREE</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold text-gray-900 dark:text-white">€0</span>
                    <span className="text-lg text-gray-600 dark:text-gray-400">/forever</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">All essential functions for training</p>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                  Stepper 3 steps (Equipment → Muscles → Exercises)
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-[#22C55E] flex-shrink-0" />8 equipment types (Bodyweight, Dumbbells, Barbell...)
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                  Exercise generation with videos
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                  Session tracking (sets/reps/weight/time)
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                  GitHub-style workout history (6 months)
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                  Share and replay sessions
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                  Self-hosting capability
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                  Open source code access
                </li>
              </ul>

              <Button
                className="w-full h-12 text-base font-semibold bg-white text-[#22C55E] border-2 border-[#22C55E] hover:bg-[#22C55E] hover:text-white transition-all duration-200 rounded-xl"
                disabled
              >
                Your actual plan
              </Button>
              <p className="mt-2 text-xs text-center text-gray-600 dark:text-gray-400">No signup required • Full access forever</p>
            </div>

            {/* PREMIUM PLAN */}
            <div className="relative bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 border-2 border-[#00D4AA]/30 dark:border-[#00D4AA]/40 shadow-xl shadow-[#00D4AA]/10 transform scale-105 transition-all duration-200 ease-out hover:scale-[1.07] hover:-translate-y-1">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-max">
                <div className="bg-gradient-to-r from-[#00D4AA] to-[#0EA5E9] text-white text-sm font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5">
                  <Zap className="w-4 h-4" />
                  MOST POPULAR • For enthusiasts
                </div>
              </div>

              <div className="text-center space-y-6 mb-8 mt-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#00D4AA] to-[#0EA5E9] rounded-2xl flex items-center justify-center mx-auto">
                    <Crown className="w-8 h-8 text-white" strokeWidth={2.5} />
                  </div>
                  {isYearly && (
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#F59E0B] rounded-xl flex items-center justify-center rotate-12">
                      <span className="text-xs font-bold text-white">-48%</span>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">PREMIUM ⭐</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold text-gray-900 dark:text-white">
                      €{isYearly ? Math.round(currentPrice) : currentPrice}
                    </span>
                    <span className="text-lg text-gray-600 dark:text-gray-400">/{currentPeriod}</span>
                  </div>
                  {isYearly && (
                    <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-[#22C55E]/10 dark:bg-[#22C55E]/20 rounded-full">
                      <div className="w-2 h-2 bg-[#22C55E] rounded-full" />
                      <span className="text-sm font-medium text-[#22C55E]">€{(currentPrice / 12).toFixed(2)}/month</span>
                    </div>
                  )}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">All features + early access</p>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-[#00D4AA] flex-shrink-0" />
                  Everything from Free plan
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-[#00D4AA] flex-shrink-0" />
                  Advanced statistics (volume, progression, PR)
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-[#00D4AA] flex-shrink-0" />
                  Pre-designed workout programs
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-[#00D4AA] flex-shrink-0" />
                  Unlimited history + data export
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-[#00D4AA] flex-shrink-0" />
                  AI coaching personalized suggestions
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-[#00D4AA] flex-shrink-0" />
                  Custom exercises with videos
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-[#00D4AA] flex-shrink-0" />
                  Private Discord community
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-[#00D4AA] flex-shrink-0" />
                  API access + early features
                </li>
              </ul>

              <Button
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-[#00D4AA] to-[#0EA5E9] hover:from-[#00D4AA]/90 hover:to-[#0EA5E9]/90 text-white shadow-lg shadow-[#00D4AA]/20 transition-all duration-200 rounded-xl hover:scale-[1.02] active:scale-[0.98]"
                disabled={checkoutMutation.isPending && selectedPlan === currentPlanId}
                onClick={() => handleUpgrade(currentPlanId)}
              >
                {checkoutMutation.isPending && selectedPlan === currentPlanId ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : !isAuthenticated ? (
                  <div className="flex items-center justify-center gap-2">
                    <LogIn className="w-5 h-5" />
                    <span>Go Premium €{isYearly ? Math.round(currentPrice) : currentPrice}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Go Premium €{isYearly ? Math.round(currentPrice) : currentPrice}</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </Button>
              <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
                {isYearly ? "Thank you for the yearly support! 🙏" : "Join the passionate community! 🔥"}
              </p>
            </div>
          </div>

          {/* Trust Elements */}
          <div className="mt-16 text-center">
            <div className="items-center justify-items-center gap-6 flex-wrap text-sm text-gray-600 dark:text-gray-400 grid grid-cols-1 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#22C55E] rounded-full" />
                <span>30-day money back guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#0EA5E9] rounded-full" />
                <span>Cancel in 1 clic,no commitment</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#F59E0B] rounded-full" />
                <span>Secure payment via Stripe</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#FF6B35] rounded-full" />
                <span>GDPR compliant & open-source</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <FeatureComparisonTable />

      {/* FAQ */}
      <PricingFAQ />

      {/* Final CTA Section */}
      <section className="py-16 bg-gradient-to-b from-[#FF6B35]/5 to-[#00D4AA]/5 dark:from-[#FF6B35]/10 dark:to-[#00D4AA]/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="relative inline-block">
              <Image alt="Happy mascot" className="mx-auto" height={80} src="/images/emojis/WorkoutCoolBiceps.png" width={80} />
              <div className="absolute -top-2 left-1/2 -translate-x-[15%] rotate-2">
                <div className="w-max px-3 h-7 bg-[#FF6B35] rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">Keep pushing! 💪</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Ready to Support the Mission?</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Join thousands of fitness enthusiasts who believe in open-source training freedom
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-[#22C55E]/10 rounded-xl flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6 text-[#22C55E]" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Community First</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Built by and for the fitness community</p>
              </div>

              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-[#FF6B35]/10 rounded-xl flex items-center justify-center mx-auto">
                  <Github className="w-6 h-6 text-[#FF6B35]" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Always Transparent</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Open-source code, transparent funding</p>
              </div>

              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-[#00D4AA]/10 rounded-xl flex items-center justify-center mx-auto">
                  <Heart className="w-6 h-6 text-[#00D4AA]" fill="currentColor" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Labor of Love</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">15 years of passion !</p>
              </div>
            </div>

            <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                &quot;We believe fitness tools should be accessible to everyone. Your support helps us maintain this vision while continuing
                to innovate.&quot;
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-600">— The Workout.cool Team</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
