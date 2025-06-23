// Configuration Stripe - À remplir avec vos informations
export const STRIPE_CONFIG = {
  // Clés publiques (peuvent être exposées côté client)
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",

  // IDs des produits/prix Stripe
  products: {
    monthly: {
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY || "",
      name: "Abonnement Mensuel",
      price: 7.9,
      currency: "eur",
    },
    yearly: {
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY || "",
      name: "Abonnement Annuel",
      price: 49.0,
      currency: "eur",
    },
  },

  // URL de retour après paiement
  successUrl: "/profile?payment=success",
  cancelUrl: "/profile?payment=cancelled",
};

// Validation de la configuration
export function validateStripeConfig() {
  if (!STRIPE_CONFIG.publishableKey) {
    console.warn("⚠️ Stripe publishable key not configured");
    return false;
  }

  if (!STRIPE_CONFIG.products.monthly.priceId && !STRIPE_CONFIG.products.yearly.priceId) {
    console.warn("⚠️ No Stripe price IDs configured");
    return false;
  }

  return true;
}
