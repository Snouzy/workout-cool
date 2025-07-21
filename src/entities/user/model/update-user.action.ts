"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/shared/lib/prisma";
import { mobileAuthenticatedActionClient } from "@/shared/api/mobile-safe-actions";
import { updateUserSchema } from "@/entities/user/schemas/update-user.schema";

export const updateUserAction = mobileAuthenticatedActionClient.schema(updateUserSchema).action(async ({ parsedInput, ctx }) => {
  const { user } = ctx as { user: any };

  if (!user) {
    throw new Error("Unauthenticated");
  }

  const { locale, firstName, lastName, image, revalidatePath: path } = parsedInput;

  // Build update object with only provided fields
  const updateData: Record<string, any> = {};
  if (locale !== undefined) updateData.locale = locale;
  if (firstName !== undefined) updateData.firstName = firstName;
  if (lastName !== undefined) updateData.lastName = lastName;
  if (image !== undefined) updateData.image = image;

  // Only perform update if there are fields to update
  if (Object.keys(updateData).length > 0) {
    await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });
  }

  // Revalidate path if provided
  if (path) {
    revalidatePath(path);
  }

  return { success: true };
});
