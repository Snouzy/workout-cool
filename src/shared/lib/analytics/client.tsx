import { OpenPanelComponent, type PostEventPayload, useOpenPanel } from "@openpanel/nextjs";

import { env } from "@/env";

const isProd = process.env.NODE_ENV === "production";

const AnalyticsProvider = function () {
  if (!env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID) {
    return null;
  }

  return (
    <OpenPanelComponent
      clientId={env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID}
      trackAttributes={true}
      trackOutgoingLinks={isProd}
      trackScreenViews={isProd}
    />
  );
};

const track = (options: { event: string } & PostEventPayload["properties"]) => {
  if (!env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID) {
    return;
  }

  if (!isProd) {
    console.log("Track", options);
    return;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { track: openTrack } = useOpenPanel();

  const { event, ...rest } = options;

  openTrack(event, rest);
};

export { AnalyticsProvider, track };
