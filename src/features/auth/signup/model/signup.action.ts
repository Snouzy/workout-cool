"use server";

import { UserRole } from "@prisma/client";

import { getI18n } from "locales/server";
import { setupAnalytics } from "@/shared/lib/analytics/server";
import { LogEvents } from "@/shared/lib/analytics/events";
import { ActionError, actionClient } from "@/shared/api/safe-actions";
import { signUpSchema } from "@/features/auth/signup/schema/signup.schema";
import { auth } from "@/features/auth/lib/better-auth";

export const signUpAction = actionClient.schema(signUpSchema).action(async ({ parsedInput }) => {
  const t = await getI18n();

  try {
    const user = await auth.api.signUpEmail({
      body: {
        email: parsedInput.email,
        password: parsedInput.password,
        role: UserRole.user,
        name: parsedInput.firstName,
        firstName: parsedInput.firstName,
        lastName: parsedInput.lastName,
      },
    });

    const analytics = await setupAnalytics({
      userId: user.user.id,
      fullName: `${parsedInput.firstName} ${parsedInput.lastName}`,
      email: parsedInput.email,
    });

    analytics.track({
      event: LogEvents.Registered.name,
      channel: LogEvents.Registered.channel,
    });

    return user;
  } catch (error) {
    console.error(error);
    throw new ActionError(t("backend_errors.EMAIL_ALREADY_EXISTS"));
  }
});
