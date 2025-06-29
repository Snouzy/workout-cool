"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Crown, ArrowRight, X } from "lucide-react";

import { useCurrentLocale } from "locales/client";
import { useIsPremium } from "@/shared/lib/premium/use-premium";
import { usePendingCheckout } from "@/shared/lib/premium/use-pending-checkout";
import { useSession } from "@/features/auth/lib/auth-client";
import { Button } from "@/components/ui/button";

export function MobileStickyCard() {
  const router = useRouter();
  const locale = useCurrentLocale();
  const isPremium = useIsPremium();
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const { storePendingCheckout } = usePendingCheckout();

  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Show after 5 seconds of scrolling
    const timer = setTimeout(() => {
      if (!isPremium && !isDismissed) {
        setIsVisible(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [isPremium, isDismissed]);

  const handleUpgrade = () => {
    if (!isAuthenticated) {
      storePendingCheckout("premium");
      const returnUrl = `/${locale}/premium`;
      router.push(`/auth/signin?redirect=${encodeURIComponent(returnUrl)}`);
      return;
    }

    // Scroll to plans section
    // eslint-disable-next-line quotes
    const plansSection = document.querySelector('[data-section="plans"]') as HTMLElement;
    if (plansSection) {
      plansSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  if (isPremium || !isVisible || isDismissed) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden" />

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-2xl">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 bg-gradient-to-br from-[#00D4AA] to-[#0EA5E9] rounded-xl flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Go Premium ⭐</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Unlock all features for €9.99/month</p>
                </div>
              </div>

              <button className="ml-2 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" onClick={handleDismiss}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <Button
              className="w-full mt-3 bg-gradient-to-r from-[#00D4AA] to-[#0EA5E9] hover:from-[#00D4AA]/90 hover:to-[#0EA5E9]/90 text-white h-11 text-sm font-semibold"
              onClick={handleUpgrade}
            >
              <span>Upgrade Now</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
