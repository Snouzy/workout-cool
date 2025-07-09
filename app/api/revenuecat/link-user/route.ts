import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

import { PremiumService } from "@/shared/lib/premium/premium.service";
import { getMobileCompatibleSession } from "@/shared/api/mobile-auth";
import { serverRequiredUser } from "@/entities/user/model/get-server-session-user";

/**
 * Link Anonymous RevenueCat User to BetterAuth Account
 *
 * POST /api/revenuecat/link-user
 *
 * Links an anonymous RevenueCat user to an authenticated BetterAuth user account.
 * This is typically called when a user makes a purchase while anonymous and then
 * later creates an account or logs in.
 */

const linkUserSchema = z.object({
  anonymousRevenueCatUserId: z.string().min(1, "Anonymous RevenueCat user ID is required"),
});

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const user = await serverRequiredUser();

    // Parse and validate request body
    const body = await request.json();
    const { anonymousRevenueCatUserId } = linkUserSchema.parse(body);

    // Check if the anonymous RevenueCat user exists
    const existingUser = await PremiumService.getUserByRevenueCatId(anonymousRevenueCatUserId);

    if (!existingUser) {
      return NextResponse.json({ error: "Anonymous RevenueCat user not found" }, { status: 404 });
    }

    // Don't allow linking if the anonymous user is already linked to a different account
    if (existingUser.id !== user.id) {
      // Check if the authenticated user already has a RevenueCat user ID
      const hasRevenueCatId = await PremiumService.hasRevenueCatUserId(user.id);

      if (hasRevenueCatId) {
        return NextResponse.json({ error: "User already has a RevenueCat account linked" }, { status: 400 });
      }

      // Link the anonymous RevenueCat user to the authenticated user
      await PremiumService.linkRevenueCatUser(user.id, anonymousRevenueCatUserId);
    }

    // Get updated premium status after linking
    const premiumStatus = await PremiumService.checkUserPremiumStatus(user.id);
    const revenueCatUserId = await PremiumService.getUserRevenueCatId(user.id);

    return NextResponse.json({
      success: true,
      revenueCatUserId,
      premiumStatus,
    });
  } catch (error) {
    console.error("Error linking RevenueCat user:", error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request data", details: error.errors }, { status: 400 });
    }

    // Handle known errors
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: "Failed to link RevenueCat user" }, { status: 500 });
  }
}

/**
 * Get RevenueCat User Info
 *
 * GET /api/revenuecat/link-user
 *
 * Gets the current user's RevenueCat user ID and premium status
 */
export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const session = await getMobileCompatibleSession(request);
    const user = session?.user;

    if (!user) {
      return NextResponse.json({
        revenueCatUserId: null,
        premiumStatus: {
          isPremium: false,
          hasRevenueCatAccount: false,
        },
      });
    }

    // Get RevenueCat user ID
    const revenueCatUserId = await PremiumService.getUserRevenueCatId(user.id);

    // Get premium status
    const premiumStatus = await PremiumService.checkUserPremiumStatus(user.id);

    return NextResponse.json({
      revenueCatUserId,
      premiumStatus,
      hasRevenueCatAccount: !!revenueCatUserId,
    });
  } catch (error) {
    console.error("Error getting RevenueCat user info:", error);

    return NextResponse.json({ error: "Failed to get RevenueCat user info" }, { status: 500 });
  }
}
