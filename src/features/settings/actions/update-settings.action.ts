"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { prisma } from "@/shared/lib/prisma";
import { settingsSchema, type SettingsFormData } from "@/features/settings/schema/settings.schema";
import { auth } from "@/features/auth/lib/better-auth";

export async function updateSettingsAction(input: SettingsFormData) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user?.id) {
      return { serverError: "error.unauthorized" };
    }

    const validatedFields = settingsSchema.parse(input);
    
    // Check if username is already taken (if provided and not empty)
    if (validatedFields.username && validatedFields.username.trim() !== "") {
      const existingUser = await prisma.user.findFirst({
        where: {
          username: validatedFields.username,
          NOT: {
            id: session.user.id,
          },
        },
      });
      
      if (existingUser) {
        return { serverError: "error.username_taken" };
      }
    }

    // Update user settings
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        username: validatedFields.username || null,
        isProfilePublic: validatedFields.isProfilePublic,
      },
    });

    // Revalidate both settings and profile pages
    revalidatePath("/settings");
    revalidatePath("/profile");
    return { success: true };
    
  } catch (error) {
    console.error("Update settings error:", error);
    if (error instanceof z.ZodError) {
      return { serverError: "error.invalid_data" };
    }
    return { serverError: "error.generic_error" };
  }
}