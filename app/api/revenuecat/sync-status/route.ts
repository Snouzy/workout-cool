import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

import { PremiumService } from "@/shared/lib/premium/premium.service";
import { serverRequiredUser } from "@/entities/user/model/get-server-session-user";

/**
 * Sync RevenueCat Status with Backend
 *
 * POST /api/revenuecat/sync-status
 *
 * Synchronizes the current RevenueCat subscription status with the backend
 * after a user logs in or their subscription status changes
 */

const syncStatusSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  isPremium: z.boolean(),
  entitlements: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const user = await serverRequiredUser();

    // Parse and validate request body
    const body = await request.json();
    const { userId, isPremium, entitlements } = syncStatusSchema.parse(body);

    // Verify the userId matches the authenticated user
    if (userId !== user.id) {
      return NextResponse.json({ error: "User ID mismatch" }, { status: 403 });
    }

    console.log(`[RevenueCat Sync] Syncing status for user ${userId}: isPremium=${isPremium}`);

    // Update user's premium status based on RevenueCat data
    if (isPremium) {
      // Grant premium access with a far future date (RevenueCat manages the actual expiry)
      const farFutureDate = new Date();
      farFutureDate.setFullYear(farFutureDate.getFullYear() + 10);
      
      await PremiumService.grantPremiumAccess(userId, farFutureDate, {
        platform: "IOS", // Default to iOS for mobile, adjust as needed
      });
    } else {
      // Revoke premium access if not premium
      await PremiumService.revokePremiumAccess(userId);
    }

    // Get updated premium status
    const premiumStatus = await PremiumService.checkUserPremiumStatus(userId);

    return NextResponse.json({
      success: true,
      premiumStatus,
      synced: true,
    });
  } catch (error) {
    console.error("Error syncing RevenueCat status:", error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request data", details: error.errors }, { status: 400 });
    }

    // Handle known errors
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: "Failed to sync RevenueCat status" }, { status: 500 });
  }
}