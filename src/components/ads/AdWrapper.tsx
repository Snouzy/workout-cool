"use client";

import { ReactNode } from "react";

import { useUserSubscription } from "@/features/ads/hooks/useUserSubscription";
import { env } from "@/env";

interface AdWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  forceShow?: boolean;
}

export function AdWrapper({ children, fallback = null, forceShow = false }: AdWrapperProps) {
  const { isPremium, isPending } = useUserSubscription();

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

  // TODO: don't show ads to self hosted users
  // Don't show ads to premium users
  if (isPremium) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
