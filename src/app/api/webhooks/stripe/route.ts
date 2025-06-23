import { NextRequest, NextResponse } from 'next/server';
import { webhookService } from '@/features/billing/model/webhook.service';
import type { StripeWebhookPayload } from '@/features/billing/model/billing.types';

// Note: Pour Stripe, vous devriez utiliser leur SDK officiel
// import Stripe from 'stripe';
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      );
    }

    // Vérifier la signature avec le SDK Stripe
    // const event = stripe.webhooks.constructEvent(
    //   body,
    //   signature,
    //   process.env.STRIPE_WEBHOOK_SECRET!
    // );

    // Pour l'exemple, on parse directement
    const payload: StripeWebhookPayload = JSON.parse(body);

    // Enregistrer le webhook pour traitement asynchrone
    const webhookEvent = await webhookService.logWebhook(
      'STRIPE',
      payload.type,
      payload,
      undefined // headers stockés dans le payload si nécessaire
    );

    // Traiter immédiatement (ou en background)
    await webhookService.processWebhook(webhookEvent.id);

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}