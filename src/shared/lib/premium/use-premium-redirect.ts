"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useIsPremium } from "./use-premium";

export function usePremiumRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPremium = useIsPremium();

  useEffect(() => {
    // Check if user just became premium and has a return URL
    if (isPremium) {
      const returnUrl = searchParams.get("return");
      if (returnUrl) {
        // Small delay to ensure premium status is fully updated
        setTimeout(() => {
          router.push(returnUrl);
        }, 1000);
      }
    }
  }, [isPremium, searchParams, router]);
}