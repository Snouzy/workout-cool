import { User } from "@prisma/client";

import { authClient } from "@/features/auth/lib/auth-client";

export interface SessionUser extends Omit<User, "image" | "createdAt" | "updatedAt" | "onboardingPreferences"> {
  image?: string | null;
}

export type Session = typeof authClient.$Infer.Session;
