"use client";

import React from "react";
import Link from "next/link";
import { Crown, Sparkles } from "lucide-react";

import { useI18n } from "locales/client";
import { cn } from "@/shared/lib/utils";
import { useUserSubscription } from "@/features/ads/hooks/useUserSubscription";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PremiumGateProps {
  children: React.ReactNode;
  feature?: string;
  fallback?: React.ReactNode;
  showUpgradePrompt?: boolean;
  onUpgradePress?: () => void;
  upgradeMessage?: string;
  className?: string;
}

/**
 * PremiumGate Component
 *
 * Gates content behind premium subscription status
 * Shows upgrade prompt or custom fallback for non-premium users
 */
export function PremiumGate({
  children,
  feature,
  fallback,
  showUpgradePrompt = true,
  onUpgradePress,
  upgradeMessage,
  className,
}: PremiumGateProps) {
  const { isPremium, isPending } = useUserSubscription();

  // Show loading state while checking premium status
  if (isPending) {
    return (
      <div className={cn("flex items-center justify-center p-8", className)}>
        <Skeleton className="h-32 w-full max-w-md" />
      </div>
    );
  }

  // Grant access if user has premium
  if (isPremium) {
    return <>{children}</>;
  }

  // Show custom fallback if provided
  if (fallback) {
    return <>{fallback}</>;
  }

  // Show upgrade prompt if enabled
  if (showUpgradePrompt) {
    return <PremiumUpgradePrompt className={className} feature={feature} message={upgradeMessage} onUpgradePress={onUpgradePress} />;
  }

  // Default: hide content
  return null;
}

interface PremiumUpgradePromptProps {
  feature?: string;
  message?: string;
  onUpgradePress?: () => void;
  className?: string;
}

function PremiumUpgradePrompt({ feature, message, onUpgradePress, className }: PremiumUpgradePromptProps) {
  const t = useI18n();
  const defaultMessage = message || t("premium.upgrade_to_access_feature");

  const handleUpgradePress = () => {
    // Track premium gate view if analytics available
    if (typeof window !== "undefined" && feature) {
      // TODO: Add analytics tracking
      console.log("Premium gate viewed:", feature);
    }

    if (onUpgradePress) {
      onUpgradePress();
    }
  };

  return (
    <Card className={cn("max-w-md mx-auto", className)}>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full">
            <Crown className="h-8 w-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">{t("premium.premium_feature")}</CardTitle>
        <CardDescription className="text-base mt-2">{defaultMessage}</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4" />
            <span>{t("premium.unlock_all_features")}</span>
          </div>

          <Link href="/premium" onClick={handleUpgradePress}>
            <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" size="large">
              {t("commons.upgrade_to_premium")}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

// Utility component for inline premium indicators
export function PremiumBadge({ size = "small", className }: { size?: "small" | "medium" | "large"; className?: string }) {
  const sizeClasses = {
    small: "px-2 py-0.5 text-xs",
    medium: "px-3 py-1 text-sm",
    large: "px-4 py-1.5 text-base",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold",
        sizeClasses[size],
        className,
      )}
    >
      <Crown className={cn(size === "small" ? "h-3 w-3" : size === "medium" ? "h-4 w-4" : "h-5 w-5")} />
      PREMIUM
    </span>
  );
}

// Higher-order component for premium feature gating
export function withPremiumGate<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  gateOptions?: Omit<PremiumGateProps, "children">,
) {
  return function PremiumGatedComponent(props: P) {
    return (
      <PremiumGate {...gateOptions}>
        <WrappedComponent {...props} />
      </PremiumGate>
    );
  };
}
