"use client";

import { ReactNode } from "react";

import { useUserSubscription } from "@/features/ads/hooks/useUserSubscription";

interface AdWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  forceShow?: boolean;
}

export function AdWrapper({ children, fallback = null, forceShow = false }: AdWrapperProps) {
  const { isPremium, isPending } = useUserSubscription();

  // Force show ads in development if forceShow is true
  if (forceShow && process.env.NODE_ENV === "development") {
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
