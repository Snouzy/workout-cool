import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/shared/lib/prisma";
import { PremiumService } from "@/shared/lib/premium/premium.service";
import { auth } from "@/features/auth/lib/better-auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Use new premium system
    const premiumStatus = await PremiumService.checkUserPremiumStatus(userId);

    // Get active subscription if present
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: "ACTIVE",
      },
      include: {
        plan: true,
      },
    });

    // Get license if present (for self-hosted)
    const license = await prisma.license.findFirst({
      where: {
        userId,
        OR: [{ validUntil: null }, { validUntil: { gte: new Date() } }],
      },
    });

    const response = {
      isPremium: premiumStatus.isPremium,
      expiresAt: premiumStatus.expiresAt,
      subscription: subscription || undefined,
      license: license || undefined,
      canUpgrade: !premiumStatus.isPremium,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Billing status error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
