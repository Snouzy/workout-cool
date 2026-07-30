"use server";

import ContactSupportEmail from "@emails/ContactSupportEmail";

import { ContactSupportSchema } from "./contact-support.schema";

import { sendEmail } from "@/shared/lib/mail/sendEmail";
import { SiteConfig } from "@/shared/config/site-config";
import { actionClient } from "@/shared/api/safe-actions";


export const contactSupportAction = actionClient.schema(ContactSupportSchema).action(async ({ parsedInput }) => {
  await sendEmail({
    from: SiteConfig.email.from,
    to: SiteConfig.email.contact,
    subject: `Support needed from ${parsedInput.email} - ${parsedInput.subject}`,
    text: parsedInput.message,
    react: ContactSupportEmail({ email: parsedInput.email, message: parsedInput.message, subject: parsedInput.subject }),
  });
  return { message: "Your message has been sent to support." };
});
