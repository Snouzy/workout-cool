import { NextRequest, NextResponse } from "next/server";

import { PremiumService } from "@/shared/lib/premium/premium.service";
import { getMobileCompatibleSession } from "@/shared/api/mobile-auth";

/**
 * GET /api/premium/subscription
 *
 * Returns user's subscription details and premium features for UI
 * Mobile-compatible endpoint that works with both web and mobile sessions
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getMobileCompatibleSession(request);
    const user = session?.user;

    if (!user) {
      return NextResponse.json({
        isActive: false,
        features: getDefaultFeatures(),
      });
    }

    const subscription = await PremiumService.getUserSubscription(user.id);
    const premiumStatus = await PremiumService.checkUserPremiumStatus(user.id);

    // Get premium features based on subscription status
    const features = premiumStatus.isPremium ? getPremiumFeatures() : getDefaultFeatures();

    return NextResponse.json({
      ...subscription,
      isPremium: premiumStatus.isPremium,
      features,
      limits: {
        workoutSessions: premiumStatus.isPremium ? "unlimited" : "limited",
        exerciseVideos: premiumStatus.isPremium ? "all" : "basic",
        exportData: premiumStatus.isPremium,
        customWorkouts: premiumStatus.isPremium,
        advancedAnalytics: premiumStatus.isPremium,
      },
    });
  } catch (error) {
    console.error("Error fetching subscription:", error);

    return NextResponse.json(
      {
        isActive: false,
        features: getDefaultFeatures(),
        error: "Failed to fetch subscription",
      },
      { status: 500 },
    );
  }
}

/**
 * Get premium features list
 */
function getPremiumFeatures() {
  return {
    unlimitedWorkouts: true,
    allExerciseVideos: true,
    exportWorkoutData: true,
    customWorkoutPlans: true,
    advancedAnalytics: true,
    prioritySupport: true,
    noAds: true,
    offlineMode: true,
    shareWorkouts: true,
    premiumTemplates: true,
  };
}

/**
 * Get default (free) features list
 */
function getDefaultFeatures() {
  return {
    unlimitedWorkouts: false,
    allExerciseVideos: false,
    exportWorkoutData: false,
    customWorkoutPlans: false,
    advancedAnalytics: false,
    prioritySupport: false,
    noAds: false,
    offlineMode: false,
    shareWorkouts: false,
    premiumTemplates: false,
  };
}
