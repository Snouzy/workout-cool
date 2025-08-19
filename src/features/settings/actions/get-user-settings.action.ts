"use server";

import { headers } from "next/headers";

import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/features/auth/lib/better-auth";

export async function getUserSettingsAction() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        username: true,
        isProfilePublic: true,
      },
    });

    if (!user) {
      return { error: "User not found" };
    }

    return {
      username: user.username || "",
      isProfilePublic: user.isProfilePublic,
    };
  } catch (error) {
    console.error("Get user settings error:", error);
    return { error: "Failed to get user settings" };
  }
}
