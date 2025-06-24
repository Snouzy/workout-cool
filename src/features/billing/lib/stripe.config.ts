import { env } from "@/env";

// TODO: I18N
export const STRIPE_CONFIG = {
  publishableKey: env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",

  products: {
    monthly: {
      priceId: env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY || "",
      name: "Abonnement Mensuel",
      price: 7.9,
      currency: "eur",
    },
    yearly: {
      priceId: env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY || "",
      name: "Abonnement Annuel",
      price: 49.0,
      currency: "eur",
    },
  },

  successUrl: "/profile?payment=success",
  cancelUrl: "/profile?payment=cancelled",
};
