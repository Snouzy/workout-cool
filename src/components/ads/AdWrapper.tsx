"use client";

import { ReactNode } from "react";

import { useBillingConfig } from "@/shared/hooks/use-billing-config";
import { useUserSubscription } from "@/features/ads/hooks/useUserSubscription";
import { env } from "@/env";

interface AdWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  forceShow?: boolean;
}

export function AdWrapper({ children, fallback = null, forceShow = false }: AdWrapperProps) {
  const { isPremium, isPending } = useUserSubscription();
  const { billingMode } = useBillingConfig();

  if (!env.NEXT_PUBLIC_SHOW_ADS) {
    return null;
  }

  // Show ads in development to preview layout
  if (process.env.NODE_ENV === "development") {
    return <>{children}</>;
  }

  // Force show ads in development if forceShow is true
  if (forceShow) {
    return <>{children}</>;
  }

  // Don't show ads while loading to prevent layout shift
  if (isPending) {
    return <>{fallback}</>;
  }

  // Don't show ads if billing is disabled (self-hosted instances with no billing)
  if (billingMode === "DISABLED") {
    return <>{fallback}</>;
  }

  // Don't show ads to premium users
  if (isPremium) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
