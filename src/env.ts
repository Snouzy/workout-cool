import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

/**
 * This is the schema for the environment variables.
 *
 * Please import **this** file and use the `env` variable
 */
export const env = createEnv({
  server: {
    BETTER_AUTH_URL: z.string().url(),
    DATABASE_URL: z.string().url(),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    RESEND_AUDIENCE_ID: z.string().optional(),
    NODE_ENV: z.enum(["development", "production", "test"]),
    BETTER_AUTH_SECRET: z.string().min(1),
    OPENPANEL_SECRET_KEY: z.string().min(1),
  },
  /**
   * If you add `client` environment variables, you need to add them to
   * `experimental__runtimeEnv` as well.
   */
  client: {
    NEXT_PUBLIC_OPENPANEL_CLIENT_ID: z.string().min(1),
    NEXT_PUBLIC_FACEBOOK_PIXEL_ID: z.string().min(1),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_OPENPANEL_CLIENT_ID: process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID,
    NEXT_PUBLIC_FACEBOOK_PIXEL_ID: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID,
  },
});
