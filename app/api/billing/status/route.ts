import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/shared/lib/prisma";
import { billingService } from "@/features/billing/model/billing.service";
import { auth } from "@/features/auth/lib/better-auth";

import type { BillingStatus } from "@/features/billing/model/billing.types";

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

    // Récupérer la configuration
    const config = await billingService.getConfiguration();

    // Vérifier le statut premium
    const isPremium = await billingService.canAccessPremiumFeature(userId);

    // Récupérer les limites
    const limits = await billingService.getUserLimits(userId);

    // Récupérer l'abonnement actif si présent
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: "ACTIVE",
      },
      include: {
        plan: true,
        payments: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    // Récupérer la licence si présente
    const license = await prisma.license.findFirst({
      where: {
        userId,
        OR: [{ validUntil: null }, { validUntil: { gte: new Date() } }],
      },
    });

    // Déterminer si l'utilisateur peut upgrader
    const canUpgrade = config.billingMode !== "DISABLED" && !isPremium;

    const response: BillingStatus = {
      isPremium,
      subscription: subscription || undefined,
      license: license || undefined,
      limits,
      canUpgrade,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Billing status error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
