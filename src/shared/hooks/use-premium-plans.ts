import { useQuery } from "@tanstack/react-query";

interface PremiumPlan {
  id: string;
  internalId: string;
  name: string;
  type: string;
  priceMonthly: number;
  priceYearly: number;
  currency: "EUR" | "USD" | "GBP";
  features: string[];
}

interface PlansResponse {
  plans: PremiumPlan[];
  detectedRegion: string;
  debug?: {
    headers: {
      country: string | null;
      acceptLanguage: string | null;
      timezone: string | null;
    };
  };
}

export function usePremiumPlans() {
  return useQuery<PlansResponse>({
    queryKey: ["premium-plans"],
    queryFn: async () => {
      // Get user timezone for better region detection
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const response = await fetch(`/api/premium/plans?tz=${encodeURIComponent(timezone)}`);
      if (!response.ok) {
        throw new Error("Failed to fetch plans");
      }
      const data = await response.json();
      return data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour (previously cacheTime)
  });
}
