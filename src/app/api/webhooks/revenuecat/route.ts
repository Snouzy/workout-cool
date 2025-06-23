import { NextRequest, NextResponse } from "next/server";

import { webhookService } from "@/features/billing/model/webhook.service";

import type { RevenueCatWebhookPayload } from "@/features/billing/model/billing.types";

// Vérifier la signature du webhook RevenueCat
function verifyRevenueCatSignature(payload: string, signature: string): boolean {
  const webhookSecret = process.env.REVENUECAT_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("REVENUECAT_WEBHOOK_SECRET not configured");
    return false;
  }

  // RevenueCat utilise une simple comparaison de string pour la vérification
  // Dans un environnement de production, vous devriez implémenter une vérification
  // cryptographique appropriée selon la documentation RevenueCat
  return signature === webhookSecret;
}

export async function POST(request: NextRequest) {
  try {
    // Récupérer le body et la signature
    const body = await request.text();
    const signature = request.headers.get("X-RevenueCat-Signature") || "";

    // Vérifier la signature
    if (!verifyRevenueCatSignature(body, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload: RevenueCatWebhookPayload = JSON.parse(body);

    // Enregistrer le webhook pour traitement asynchrone
    const webhookEvent = await webhookService.logWebhook(
      "REVENUECAT",
      payload.event.type,
      payload,
      undefined, // headers stockés dans le payload si nécessaire
      payload.event.app_user_id,
    );

    // Traiter immédiatement (ou vous pouvez le faire en background)
    await webhookService.processWebhook(webhookEvent.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("RevenueCat webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
