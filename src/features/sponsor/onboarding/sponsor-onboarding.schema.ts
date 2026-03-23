import { z } from "zod";

export const SponsorOnboardingSchema = z.object({
  brandName: z.string().min(1, "Brand name is required"),
  email: z.string().email("Invalid email address"),
  websiteUrl: z.string().url("Invalid URL"),
  logoUrl: z.string().url("Invalid logo URL"),
  tagline: z.string().optional(),
  notes: z.string().optional(),
});

export type SponsorOnboardingSchemaType = z.infer<typeof SponsorOnboardingSchema>;
