"use client";

import { useQuery } from "@tanstack/react-query";

import { useSession } from "@/features/auth/lib/auth-client";

import type { PremiumStatus, UserSubscription } from "@/shared/types/premium.types";

export function usePremiumStatus() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["premium-status", session?.user?.id],
    queryFn: async (): Promise<PremiumStatus> => {
      if (!session?.user?.id) {
        return { isPremium: false };
      }

      const response = await fetch("/api/premium/status");
      if (!response.ok) {
        throw new Error("Failed to fetch premium status");
      }

      return response.json();
    },
    enabled: !!session?.user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useSubscription() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["subscription", session?.user?.id],
    queryFn: async (): Promise<UserSubscription> => {
      if (!session?.user?.id) {
        return { isActive: false };
      }

      const response = await fetch("/api/premium/subscription");
      if (!response.ok) {
        throw new Error("Failed to fetch subscription");
      }

      return response.json();
    },
    enabled: !!session?.user?.id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// Simple boolean check - most common use case
export function useIsPremium(): boolean {
  const { data: premiumStatus } = usePremiumStatus();
  return premiumStatus?.isPremium ?? false;
}
