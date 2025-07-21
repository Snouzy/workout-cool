"use server";


import { prisma } from "@/shared/lib/prisma";
import { ERROR_MESSAGES } from "@/shared/constants/errors";
import { ActionError } from "@/shared/api/safe-actions";
import { mobileAuthenticatedActionClient } from "@/shared/api/mobile-safe-actions";
import { UpdatePasswordSchema } from "@/features/update-password/model/update-password.schema";
import { validatePassword } from "@/features/update-password/lib/validate-password";
import { hashStringWithSalt } from "@/features/update-password/lib/hash";
import { env } from "@/env";

/**
 * Core password update logic that can be used by both the action and API route
 */
export async function updateUserPassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
) {
  if (newPassword !== confirmPassword) {
    throw new ActionError(ERROR_MESSAGES.PASSWORDS_DO_NOT_MATCH);
  }

  const { password, id } = await prisma.account.findFirstOrThrow({
    where: { userId },
    select: { password: true, id: true },
  });

  const hashedCurrentPassword = hashStringWithSalt(currentPassword, env.BETTER_AUTH_SECRET);

  if (hashedCurrentPassword !== password) {
    throw new ActionError(ERROR_MESSAGES.INVALID_CURRENT_PASSWORD);
  }

  if (!validatePassword(newPassword)) {
    throw new ActionError(ERROR_MESSAGES.INVALID_NEW_PASSWORD);
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      accounts: {
        update: {
          where: {
            id,
            userId,
          },
          data: {
            password: hashStringWithSalt(newPassword, env.BETTER_AUTH_SECRET),
          },
        },
      },
    },
  });

  return updatedUser;
}

export const updatePasswordAction = mobileAuthenticatedActionClient
  .schema(UpdatePasswordSchema)
  .action(async ({ parsedInput, ctx }) => {
      const { confirmPassword, currentPassword, newPassword } = parsedInput;
      const { user } = ctx as { user: any };

      return updateUserPassword(user.id, currentPassword, newPassword, confirmPassword);
    });
