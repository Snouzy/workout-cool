import { admin, customSession } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { betterAuth } from "better-auth";
import { UserRole } from "@prisma/client";

import { VerifyEmail } from "@emails/VerifyEmail";
import { ResetPasswordEmail } from "@emails/ResetPasswordEmail";
import { prisma } from "@/shared/lib/prisma";
import { sendEmail } from "@/shared/lib/mail/sendEmail";
import { hashStringWithSalt } from "@/features/update-password/lib/hash";
import { env } from "@/env";

export const auth = betterAuth({
  // trustedOrigins: [SiteConfig.prodUrl, "localhost:3000", "https://better-auth.com", "http://localhost:3000"],
  trustedOrigins: ["*", "workoutcool://", "expo://"],
  plugins: [
    admin(),
    customSession(async ({ user, session }) => {
      console.log("⛏️ customSession executed - fetched from DB - whole user and session data is this ->> \n");
      const userFromDB = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          id: true,
          email: true,
          emailVerified: true,
          name: true,
          firstName: true,
          lastName: true,
          image: true,
          locale: true,
          role: true,
          banned: true,
          banReason: true,
          banExpires: true,
          isPremium: true,
          accounts: {
            select: { providerId: true },
          },
        },
      });

      return {
        user: userFromDB,
        session,
      };
    }),
    nextCookies(),
  ],
  user: {
    additionalFields: {
      email: {
        type: "string",
      },
      name: {
        type: "string",
      },
      role: {
        type: "string",
      },
      firstName: {
        type: "string",
      },
      lastName: {
        type: "string",
      },
    },
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: false, // FIXME: TEMPORARY
    sendVerificationEmail: async ({ user, url }, _req) => {
      try {
        const urlObject = new URL(url);
        const params = new URLSearchParams(urlObject.search);
        params.set("callbackURL", "/");

        // reconstruction
        urlObject.search = params.toString();
        const finalUrl = urlObject.toString();

        await sendEmail({
          to: user.email,
          subject: "Verify your email address",
          text: `Click the link to verify your email: ${finalUrl}`,
          react: VerifyEmail({ url: finalUrl }),
        });
      } catch (error) {
        console.error("Error sending verification email:", error);
      }
    },
  },
  emailAndPassword: {
    requireEmailVerification: false, // FIXME: TEMPORARY
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
        react: ResetPasswordEmail({ url }),
      });
    },
    password: {
      hash: async (password: string) => {
        const hashedPassword = hashStringWithSalt(password, env.BETTER_AUTH_SECRET);
        return hashedPassword;
      },
      verify: async ({ password, hash }) => {
        const hashedPassword = hashStringWithSalt(password, env.BETTER_AUTH_SECRET);
        return hashedPassword === hash;
      },
    },
    enabled: true,
  },
  socialProviders: {
    google: {
      enabled: true,
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      mapProfileToUser: async (profile) => {
        return {
          ...profile,
          email: profile.email,
          firstName: profile.given_name,
          lastName: profile.family_name,
          role: UserRole.user,
        };
      },
    },
  },
});
