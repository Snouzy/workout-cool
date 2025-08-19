import { z } from "zod";

export const settingsSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(/^[a-zA-Z0-9_-]*$/, "Username can only contain letters, numbers, hyphens, and underscores")
    .optional()
    .or(z.literal("")),
  isProfilePublic: z.boolean(),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;