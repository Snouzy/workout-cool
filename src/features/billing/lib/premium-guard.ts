import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/features/auth/lib/better-auth";

import { billingService } from "../model/billing.service";

export async function requiresPremium(request: NextRequest, handler: (request: NextRequest) => Promise<NextResponse>) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const canAccess = await billingService.canAccessPremiumFeature(session.user.id);

  if (!canAccess) {
    return NextResponse.json(
      {
        error: "Premium subscription required",
        code: "PREMIUM_REQUIRED",
      },
      { status: 403 },
    );
  }

  return handler(request);
}

// Example :
/*
export async function POST(request: NextRequest) {
  return requiresPremium(request, async (req) => {
    return NextResponse.json({ success: true });
  });
}
*/
