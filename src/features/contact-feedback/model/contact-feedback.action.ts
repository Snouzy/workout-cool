"use server";

import { ContactFeedbackSchema } from "./contact-feedback.schema";

import { prisma } from "@/shared/lib/prisma";
import { sendEmail } from "@/shared/lib/mail/sendEmail";
import { SiteConfig } from "@/shared/config/site-config";
import { actionClient } from "@/shared/api/safe-actions";
import { serverAuth } from "@/entities/user/model/get-server-session-user";


export const contactFeedbackAction = actionClient.schema(ContactFeedbackSchema).action(async ({ parsedInput }) => {
  const user = await serverAuth();
  const email = user?.email ?? parsedInput.email;

  const feedback = await prisma.feedbacks.create({
    data: {
      message: parsedInput.message,
      review: Number(parsedInput.review) || 0,
      userId: user?.id,
      email,
    },
  });

  await sendEmail({
    from: SiteConfig.email.from,
    to: SiteConfig.email.contact,
    subject: `New feedback from ${email}`,
    text: `Review: ${feedback.review}\n\nMessage: ${feedback.message}`,
  });

  return { message: "Your feedback has been sent to support." };
});
