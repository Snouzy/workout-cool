import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { webhookService } from '@/features/billing/model/webhook.service';
import type { LemonSqueezyWebhookPayload } from '@/features/billing/model/billing.types';

// Vérifier la signature du webhook LemonSqueezy
function verifyLemonSqueezySignature(payload: string, signature: string): boolean {
  const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('LEMONSQUEEZY_WEBHOOK_SECRET not configured');
    return false;
  }

  // LemonSqueezy utilise HMAC SHA256
  const hash = crypto
    .createHmac('sha256', webhookSecret)
    .update(payload)
    .digest('hex');

  return hash === signature;
}

export async function POST(request: NextRequest) {
  try {
    // Récupérer le body et la signature
    const body = await request.text();
    const signature = request.headers.get('X-Signature') || '';

    // Vérifier la signature
    if (!verifyLemonSqueezySignature(body, signature)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const payload: LemonSqueezyWebhookPayload = JSON.parse(body);

    // Enregistrer le webhook pour traitement asynchrone
    const webhookEvent = await webhookService.logWebhook(
      'LEMONSQUEEZY',
      payload.meta.event_name,
      payload,
      undefined, // headers stockés dans le payload si nécessaire
      // Extraire l'user ID si disponible dans le payload
      payload.data.attributes?.user_email
    );

    // Traiter immédiatement (ou en background)
    await webhookService.processWebhook(webhookEvent.id);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('LemonSqueezy webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}