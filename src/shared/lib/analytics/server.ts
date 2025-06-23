import { cookies } from "next/headers";
import { waitUntil } from "@vercel/functions";
import { OpenPanel, type PostEventPayload } from "@openpanel/nextjs";

import { env } from "@/env";

type Props = {
  userId?: string;
  fullName?: string | null;
  email?: string | null;
};

export const setupAnalytics = async (options?: Props) => {
  const cookiesStore = await cookies();
  const { userId, fullName, email } = options ?? {};
  const trackingConsent = !cookiesStore.has("tracking-consent") || cookiesStore.get("tracking-consent")?.value === "1";

  const client = new OpenPanel({
    clientId: env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID!,
    clientSecret: env.OPENPANEL_SECRET_KEY,
  });

  if (trackingConsent && userId && fullName) {
    const [firstName, lastName] = fullName.split(" ");

    waitUntil(
      client.identify({
        profileId: userId,
        firstName,
        lastName,
        email: email ?? undefined,
      }),
    );
  }

  return {
    track: (options: { event: string } & PostEventPayload["properties"]) => {
      if (env.NODE_ENV !== "production") {
        console.log("Track", options);
        return;
      }

      const { event, ...rest } = options;

      waitUntil(client.track(event, rest));
    },
  };
};
