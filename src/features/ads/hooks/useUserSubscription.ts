"use client";

import { useSession } from "@/features/auth/lib/auth-client";

export function useUserSubscription() {
  const { data: session, ...rest } = useSession();
  const isPremium = session?.user?.isPremium || false;

  return { isPremium, ...rest };
}
