"use server";

import SponsorOnboardingEmail from "@emails/SponsorOnboardingEmail";

import { SponsorOnboardingSchema } from "./sponsor-onboarding.schema";

import { sendEmail } from "@/shared/lib/mail/sendEmail";
import { SiteConfig } from "@/shared/config/site-config";
import { actionClient } from "@/shared/api/safe-actions";


export const sponsorOnboardingAction = actionClient.schema(SponsorOnboardingSchema).action(async ({ parsedInput }) => {
  await sendEmail({
    from: SiteConfig.email.from,
    to: SiteConfig.email.contact,
    subject: `New Sponsor: ${parsedInput.brandName}`,
    text: `New sponsor onboarding: ${parsedInput.brandName} (${parsedInput.email}) - ${parsedInput.websiteUrl}`,
    react: SponsorOnboardingEmail(parsedInput),
  });

  return { message: "Your sponsorship details have been submitted successfully." };
});
