import { useQuery } from "@tanstack/react-query";

import type { BillingStatus } from "./billing.types";

export function useBillingStatus() {
  return useQuery<BillingStatus>({
    queryKey: ["billing-status"],
    queryFn: async () => {
      const response = await fetch("/api/billing/status");

      if (!response.ok) {
        throw new Error("Failed to fetch billing status");
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useCanAccessPremium() {
  const { data, isLoading } = useBillingStatus();

  return {
    canAccess: data?.isPremium ?? false,
    isLoading,
    limits: data?.limits,
  };
}
