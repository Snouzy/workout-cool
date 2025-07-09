import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

import { PremiumService } from "@/shared/lib/premium/premium.service";
import { serverRequiredUser } from "@/entities/user/model/get-server-session-user";

/**
 * Assign RevenueCat User ID to BetterAuth Account
 *
 * POST /api/revenuecat/assign-user-id
 *
 * Assigns a RevenueCat user ID to a BetterAuth user account.
 * This is typically called during user registration or first app launch.
 */

const assignUserIdSchema = z.object({
  revenueCatUserId: z.string().min(1, "RevenueCat user ID is required"),
});

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const user = await serverRequiredUser();

    // Parse and validate request body
    const body = await request.json();
    const { revenueCatUserId } = assignUserIdSchema.parse(body);

    // Check if user already has a RevenueCat user ID
    const existingRevenueCatId = await PremiumService.getUserRevenueCatId(user.id);

    if (existingRevenueCatId) {
      // If it's the same ID, return success
      if (existingRevenueCatId === revenueCatUserId) {
        return NextResponse.json({
          success: true,
          revenueCatUserId: existingRevenueCatId,
          message: "RevenueCat user ID already assigned",
        });
      }

      // If it's a different ID, return error
      return NextResponse.json({ error: "User already has a different RevenueCat user ID assigned" }, { status: 400 });
    }

    // Assign the RevenueCat user ID
    await PremiumService.assignRevenueCatUserId(user.id, revenueCatUserId);

    // Get updated premium status
    const premiumStatus = await PremiumService.checkUserPremiumStatus(user.id);

    return NextResponse.json({
      success: true,
      revenueCatUserId,
      premiumStatus,
    });
  } catch (error) {
    console.error("Error assigning RevenueCat user ID:", error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request data", details: error.errors }, { status: 400 });
    }

    // Handle known errors
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: "Failed to assign RevenueCat user ID" }, { status: 500 });
  }
}

/**
 * Generate RevenueCat User ID
 *
 * GET /api/revenuecat/assign-user-id
 *
 * Generates a unique RevenueCat user ID for the current user if they don't have one
 */
export async function GET() {
  try {
    // Get authenticated user
    const user = await serverRequiredUser();

    // Check if user already has a RevenueCat user ID
    const existingRevenueCatId = await PremiumService.getUserRevenueCatId(user.id);

    if (existingRevenueCatId) {
      return NextResponse.json({
        revenueCatUserId: existingRevenueCatId,
        alreadyAssigned: true,
      });
    }

    // Generate a new RevenueCat user ID based on the user's BetterAuth ID
    const revenueCatUserId = `workout_cool_${user.id}`;

    // Assign the RevenueCat user ID
    await PremiumService.assignRevenueCatUserId(user.id, revenueCatUserId);

    return NextResponse.json({
      revenueCatUserId,
      alreadyAssigned: false,
    });
  } catch (error) {
    console.error("Error generating RevenueCat user ID:", error);

    return NextResponse.json({ error: "Failed to generate RevenueCat user ID" }, { status: 500 });
  }
}
