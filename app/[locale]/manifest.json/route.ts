import { NextRequest } from "next/server";

import { getLocalizedMetadata } from "@/shared/config/localized-metadata";

export async function GET(request: NextRequest, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const localizedData = getLocalizedMetadata(locale);

  const manifest = {
    background_color: "#f3f4f6",
    categories: ["health", "fitness", "sports"],
    description: localizedData.description,
    display: "standalone",
    icons: [
      {
        src: "/images/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        src: "/images/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
    lang: locale,
    name: localizedData.applicationName,
    orientation: "portrait",
    scope: `/${locale}/`,
    short_name: localizedData.applicationName,
    start_url: `/${locale}/`,
    theme_color: "#FF5722",
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
