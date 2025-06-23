🔄 Flux de Fonctionnement

1. Vérification des Permissions

// billingService.canAccessPremiumFeature(userId)

1. Récupère la configuration globale
2. Selon le billingMode:

   - DISABLED → return true (tout gratuit)
   - LICENSE_KEY → vérifie si l'utilisateur a une licence valide
   - SUBSCRIPTION/FREEMIUM → vérifie: a) Abonnement actif b) Champ isPremium legacy c) Date premiumUntil

3. Flux des Webhooks

RevenueCat/Stripe/LemonSqueezy 
        ↓
Webhook reçu 
        ↓
Vérification signature 
        ↓
Enregistrement dans webhook_events 
        ↓
Traitement immédiat ou async 
        ↓
Mise à jour subscription/user 
        ↓
Marqué comme processed

Exemple concret - RevenueCat :

1. L'app mobile fait un achat
2. RevenueCat envoie un webhook à /api/webhooks/revenuecat
3. Le webhook est vérifié et enregistré
4. webhookService.processWebhook() traite l'événement
5. Selon le type (INITIAL_PURCHASE, RENEWAL, etc.), met à jour :

   - La table subscriptions
   - Les champs isPremium et premiumUntil de l'utilisateur

   3. API Endpoints

/api/billing/status - Statut de facturation

GET → { isPremium: boolean, subscription?: { plan, payments }, license?: { key, validUntil }, limits: { maxWorkouts, maxExercises },
canUpgrade: boolean }

/api/webhooks/[provider] - Réception des webhooks

- /api/webhooks/revenuecat - Pour l'app mobile
- /api/webhooks/stripe - Pour Stripe
- /api/webhooks/lemonsqueezy - Pour LemonSqueezy
- etc.

/api/webhooks/retry - Retraiter les webhooks échoués

POST (admin only) → Retraite tous les webhooks non processés

🔧 Services Principaux

BillingService - Logique métier

- getConfiguration() : Récupère la config globale
- canAccessPremiumFeature(userId) : Vérifie les permissions
- getUserLimits(userId) : Retourne les limites de l'utilisateur
- createSubscription() : Crée/met à jour un abonnement
- validateLicense() : Valide une licence self-hosted

WebhookService - Gestion des webhooks

- logWebhook() : Enregistre un webhook reçu
- processWebhook() : Traite un webhook selon son provider
- handleWebhookError() : Gère les erreurs et retry
- processUnprocessedWebhooks() : Retraite les webhooks en échec

💻 Utilisation Côté Client

Hook React

const { canAccess, isLoading, limits } = useCanAccessPremium();

if (!canAccess) { return <UpgradePrompt limits={limits} />; }

Composant PremiumBadge

<PremiumBadge /> // Affiche un badge si l'utilisateur est premium

Protection des routes API

export async function POST(request: NextRequest) { return requiresPremium(request, async (req) => { // Code réservé aux utilisateurs premium
}); }

🔀 Changement de Provider

Pour passer de Stripe à LemonSqueezy :

1. Mettre à jour la configuration : await billingService.updateConfiguration({ activeProcessor: 'LEMONSQUEEZY' });

2. Configurer les nouvelles clés API : LEMONSQUEEZY_API_KEY=xxx LEMONSQUEEZY_WEBHOOK_SECRET=xxx

3. Rediriger les webhooks dans le dashboard LemonSqueezy

C'est tout ! L'architecture gère automatiquement le nouveau provider.

🚀 Modes de Déploiement

Mode SaaS (SUBSCRIPTION)

- Abonnements gérés par processeur externe
- Webhooks pour synchronisation
- Support multi-plateforme (web + mobile)

Mode Self-Hosted Gratuit (DISABLED)

- Toutes les fonctionnalités débloquées
- Pas de dépendance externe
- Idéal pour usage personnel

Mode Self-Hosted avec Licence (LICENSE_KEY)

- Validation par clé de licence
- Limites par licence (nb utilisateurs, durée)
- Pour déploiements entreprise

Mode Freemium (FREEMIUM)

- Fonctionnalités de base gratuites
- Limites configurables
- Upgrade vers premium possible

🔒 Sécurité

1. Vérification des signatures webhook selon chaque provider
2. Retry automatique avec limite (3 essais par défaut)
3. Traçabilité complète dans webhook_events
4. Isolation des erreurs - un webhook en échec n'affecte pas les autres

📱 Intégration Mobile (RevenueCat)

L'app mobile utilise RevenueCat qui :

1. Gère les achats App Store/Google Play
2. Envoie des webhooks à votre backend
3. Synchronise avec la même base de données
4. Permet une expérience unifiée web + mobile

Cette architecture garantit une flexibilité maximale tout en restant simple à maintenir et évolutive.
