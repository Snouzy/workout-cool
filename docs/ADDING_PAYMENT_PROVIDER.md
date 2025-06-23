# Guide : Ajouter un nouveau processeur de paiement

Ce guide explique comment ajouter rapidement un nouveau processeur de paiement (ex: Paddle, Mollie, etc.) à l'architecture existante.

## 1. Ajouter le provider à l'enum

Dans `prisma/schema.prisma`, ajoutez votre provider à l'enum `PaymentProcessor` :

```prisma
enum PaymentProcessor {
  STRIPE
  PAYPAL
  LEMONSQUEEZY
  PADDLE
  MOLLIE        // ← Nouveau provider
  APPLE_PAY
  GOOGLE_PAY
  REVENUECAT
  NONE
  OTHER
}
```

Puis lancez la migration :

```bash
npx prisma migrate dev --name add-mollie-provider
```

## 2. Ajouter les types TypeScript

Dans `src/features/billing/model/billing.types.ts`, ajoutez les types pour les webhooks :

```typescript
// Mollie specific
export interface MollieWebhookPayload {
  id: string;
  mode: 'live' | 'test';
  amount: {
    value: string;
    currency: string;
  };
  status: MolliePaymentStatus;
  metadata?: {
    userId?: string;
    subscriptionId?: string;
  };
}

export type MolliePaymentStatus = 
  | 'pending'
  | 'paid'
  | 'failed'
  | 'canceled'
  | 'expired';
```

## 3. Créer la route webhook

Créez `src/app/api/webhooks/mollie/route.ts` :

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { webhookService } from '@/features/billing/model/webhook.service';
import type { MollieWebhookPayload } from '@/features/billing/model/billing.types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    // Ajouter la vérification de signature selon la doc Mollie
    
    const payload: MollieWebhookPayload = JSON.parse(body);

    // Enregistrer le webhook
    const webhookEvent = await webhookService.logWebhook(
      'MOLLIE',
      payload.status,
      payload,
      request.headers,
      payload.metadata?.userId
    );

    // Traiter
    await webhookService.processWebhook(webhookEvent.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mollie webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## 4. Implémenter le handler

Dans `src/features/billing/model/webhook.service.ts`, ajoutez :

1. Le case dans le switch :
```typescript
case 'MOLLIE':
  result = await this.processMollieWebhook(event.payload);
  break;
```

2. La méthode de traitement :
```typescript
private async processMollieWebhook(payload: MollieWebhookPayload) {
  switch (payload.status) {
    case 'paid': {
      // Logique pour paiement réussi
      if (payload.metadata?.subscriptionId) {
        // Activer l'abonnement
      }
      return { action: 'payment_completed' };
    }
    
    case 'failed':
    case 'canceled': {
      // Logique pour échec
      return { action: 'payment_failed' };
    }
  }
  
  return { action: payload.status };
}
```

## 5. Ajouter les variables d'environnement

Dans `.env` :

```env
MOLLIE_API_KEY=
MOLLIE_WEBHOOK_SECRET=
```

## 6. Configurer le webhook dans Mollie

Dans le dashboard Mollie, configurez l'URL du webhook :
- Production : `https://votre-domaine.com/api/webhooks/mollie`
- Test : `https://localhost:3000/api/webhooks/mollie`

## C'est tout ! 🎉

Votre nouveau provider est maintenant intégré. L'architecture gère automatiquement :
- ✅ L'enregistrement des webhooks
- ✅ Le retry en cas d'échec
- ✅ La traçabilité des événements
- ✅ Le changement de provider sans migration

## Test

Pour tester votre intégration :

1. Utilisez les outils de test du provider (ex: Mollie test mode)
2. Vérifiez les logs dans la table `webhook_events`
3. Testez le retry avec la route `/api/webhooks/retry`