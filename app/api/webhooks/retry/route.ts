import { NextRequest, NextResponse } from "next/server";

import { webhookService } from "@/features/billing/model/webhook.service";
import { auth } from "@/features/auth/lib/better-auth";

export async function POST(request: NextRequest) {
  try {
    // Vérifier que l'utilisateur est admin
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Process unprocessed webhooks
    await webhookService.processUnprocessedWebhooks();

    return NextResponse.json({
      success: true,
      message: "Webhook processing initiated",
    });
  } catch (error) {
    console.error("Webhook retry error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
