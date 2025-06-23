"use client";

import { Crown } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { useCanAccessPremium } from "../model/useBillingStatus";

export function PremiumBadge() {
  const { canAccess, isLoading } = useCanAccessPremium();

  if (isLoading || !canAccess) {
    return null;
  }

  return (
    <Badge className="gap-1" variant="purple">
      <Crown className="h-3 w-3" />
      Premium
    </Badge>
  );
}
