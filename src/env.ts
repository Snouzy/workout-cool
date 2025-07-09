import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

const booleanString = z.enum(["true", "false"]).transform((val) => val === "true");

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
    NODE_ENV: z.enum(["development", "production", "test"]),
    BETTER_AUTH_SECRET: z.string().min(1),
    OPENPANEL_SECRET_KEY: z.string().optional(),
    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.coerce.number().positive().optional(),
    SMTP_USER: z.string().optional(),
    SMTP_PASS: z.string().optional(),
    SMTP_FROM: z.string().optional(),
    //issue fixed in zod 4. See https://github.com/colinhacks/zod/issues/3906
    SMTP_SECURE: booleanString.default("false"),

    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
  },
  /**
   * If you add `client` environment variables, you need to add them to
   * `experimental__runtimeEnv` as well.
   */
  client: {
    NEXT_PUBLIC_OPENPANEL_CLIENT_ID: z.string().optional(),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_STRIPE_PRICE_MONTHLY_EU: z.string().optional(),
    NEXT_PUBLIC_STRIPE_PRICE_YEARLY_EU: z.string().optional(),
    NEXT_PUBLIC_STRIPE_PRICE_MONTHLY_US: z.string().optional(),
    NEXT_PUBLIC_STRIPE_PRICE_YEARLY_US: z.string().optional(),
    NEXT_PUBLIC_STRIPE_PRICE_MONTHLY_LATAM: z.string().optional(),
    NEXT_PUBLIC_STRIPE_PRICE_YEARLY_LATAM: z.string().optional(),
    NEXT_PUBLIC_STRIPE_PRICE_MONTHLY_BR: z.string().optional(),
    NEXT_PUBLIC_STRIPE_PRICE_YEARLY_BR: z.string().optional(),
    NEXT_PUBLIC_STRIPE_PRICE_MONTHLY_RU: z.string().optional(),
    NEXT_PUBLIC_STRIPE_PRICE_YEARLY_RU: z.string().optional(),
    NEXT_PUBLIC_STRIPE_PRICE_MONTHLY_CN: z.string().optional(),
    NEXT_PUBLIC_STRIPE_PRICE_YEARLY_CN: z.string().optional(),
    NEXT_PUBLIC_SHOW_ADS: booleanString.optional(),
    NEXT_PUBLIC_AD_CLIENT: z.string().optional(),
    NEXT_PUBLIC_VERTICAL_LEFT_BANNER_AD_SLOT: z.string().optional(),
    NEXT_PUBLIC_VERTICAL_RIGHT_BANNER_AD_SLOT: z.string().optional(),
    NEXT_PUBLIC_EQUIPMENT_SELECTION_BANNER_AD_SLOT: z.string().optional(),
    NEXT_PUBLIC_EXERCISE_SELECTION_BANNER_AD_SLOT: z.string().optional(),
    NEXT_PUBLIC_MUSCLE_SELECTION_BANNER_AD_SLOT: z.string().optional(),
    NEXT_PUBLIC_TOP_WORKOUT_SESSION_BANNER_AD_SLOT: z.string().optional(),
    NEXT_PUBLIC_BOTTOM_WORKOUT_SESSION_BANNER_AD_SLOT: z.string().optional(),
    NEXT_PUBLIC_TOP_STEPPER_STEP_1_BANNER_AD_SLOT: z.string().optional(),
    NEXT_PUBLIC_TOP_STEPPER_STEP_2_BANNER_AD_SLOT: z.string().optional(),
    NEXT_PUBLIC_TOP_STEPPER_STEP_3_BANNER_AD_SLOT: z.string().optional(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_OPENPANEL_CLIENT_ID: process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_STRIPE_PRICE_MONTHLY_EU: process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY_EU,
    NEXT_PUBLIC_STRIPE_PRICE_YEARLY_EU: process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY_EU,
    NEXT_PUBLIC_STRIPE_PRICE_MONTHLY_US: process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY_US,
    NEXT_PUBLIC_STRIPE_PRICE_YEARLY_US: process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY_US,
    NEXT_PUBLIC_STRIPE_PRICE_MONTHLY_LATAM: process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY_LATAM,
    NEXT_PUBLIC_STRIPE_PRICE_YEARLY_LATAM: process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY_LATAM,
    NEXT_PUBLIC_STRIPE_PRICE_MONTHLY_BR: process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY_BR,
    NEXT_PUBLIC_STRIPE_PRICE_YEARLY_BR: process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY_BR,
    NEXT_PUBLIC_STRIPE_PRICE_MONTHLY_RU: process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY_RU,
    NEXT_PUBLIC_STRIPE_PRICE_YEARLY_RU: process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY_RU,
    NEXT_PUBLIC_STRIPE_PRICE_MONTHLY_CN: process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY_CN,
    NEXT_PUBLIC_STRIPE_PRICE_YEARLY_CN: process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY_CN,
    NEXT_PUBLIC_SHOW_ADS: process.env.NEXT_PUBLIC_SHOW_ADS,
    NEXT_PUBLIC_AD_CLIENT: process.env.NEXT_PUBLIC_AD_CLIENT,
    NEXT_PUBLIC_VERTICAL_LEFT_BANNER_AD_SLOT: process.env.NEXT_PUBLIC_VERTICAL_LEFT_BANNER_AD_SLOT,
    NEXT_PUBLIC_VERTICAL_RIGHT_BANNER_AD_SLOT: process.env.NEXT_PUBLIC_VERTICAL_RIGHT_BANNER_AD_SLOT,
    NEXT_PUBLIC_EQUIPMENT_SELECTION_BANNER_AD_SLOT: process.env.NEXT_PUBLIC_EQUIPMENT_SELECTION_BANNER_AD_SLOT,
    NEXT_PUBLIC_EXERCISE_SELECTION_BANNER_AD_SLOT: process.env.NEXT_PUBLIC_EXERCISE_SELECTION_BANNER_AD_SLOT,
    NEXT_PUBLIC_MUSCLE_SELECTION_BANNER_AD_SLOT: process.env.NEXT_PUBLIC_MUSCLE_SELECTION_BANNER_AD_SLOT,
    NEXT_PUBLIC_TOP_WORKOUT_SESSION_BANNER_AD_SLOT: process.env.NEXT_PUBLIC_TOP_WORKOUT_SESSION_BANNER_AD_SLOT,
    NEXT_PUBLIC_BOTTOM_WORKOUT_SESSION_BANNER_AD_SLOT: process.env.NEXT_PUBLIC_BOTTOM_WORKOUT_SESSION_BANNER_AD_SLOT,
    NEXT_PUBLIC_TOP_STEPPER_STEP_1_BANNER_AD_SLOT: process.env.NEXT_PUBLIC_TOP_STEPPER_STEP_1_BANNER_AD_SLOT,
    NEXT_PUBLIC_TOP_STEPPER_STEP_2_BANNER_AD_SLOT: process.env.NEXT_PUBLIC_TOP_STEPPER_STEP_2_BANNER_AD_SLOT,
    NEXT_PUBLIC_TOP_STEPPER_STEP_3_BANNER_AD_SLOT: process.env.NEXT_PUBLIC_TOP_STEPPER_STEP_3_BANNER_AD_SLOT,
  },
});
