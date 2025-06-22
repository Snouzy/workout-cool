import { MetadataRoute } from "next/types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.workout.cool";
  const currentDate = new Date().toISOString();

  // Static routes with locale support
  const staticRoutes = [
    // Home pages
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/fr`,
      lastModified: currentDate,
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/en`,
      lastModified: currentDate,
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    // Auth pages (lower priority as they're functional pages)
    {
      url: `${baseUrl}/auth/signin`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/auth/signup`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    // About pages
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/fr/about`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/about`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    // Legal pages
    {
      url: `${baseUrl}/legal/privacy`,
      lastModified: currentDate,
      changeFrequency: "yearly" as const,
      priority: 0.2,
    },
    {
      url: `${baseUrl}/legal/terms`,
      lastModified: currentDate,
      changeFrequency: "yearly" as const,
      priority: 0.2,
    },
    {
      url: `${baseUrl}/legal/sales-terms`,
      lastModified: currentDate,
      changeFrequency: "yearly" as const,
      priority: 0.2,
    },
    {
      url: `${baseUrl}/fr/legal/privacy`,
      lastModified: currentDate,
      changeFrequency: "yearly" as const,
      priority: 0.2,
    },
    {
      url: `${baseUrl}/fr/legal/terms`,
      lastModified: currentDate,
      changeFrequency: "yearly" as const,
      priority: 0.2,
    },
    {
      url: `${baseUrl}/fr/legal/sales-terms`,
      lastModified: currentDate,
      changeFrequency: "yearly" as const,
      priority: 0.2,
    },
    {
      url: `${baseUrl}/en/legal/privacy`,
      lastModified: currentDate,
      changeFrequency: "yearly" as const,
      priority: 0.2,
    },
    {
      url: `${baseUrl}/en/legal/terms`,
      lastModified: currentDate,
      changeFrequency: "yearly" as const,
      priority: 0.2,
    },
    {
      url: `${baseUrl}/en/legal/sales-terms`,
      lastModified: currentDate,
      changeFrequency: "yearly" as const,
      priority: 0.2,
    },
  ];

  return staticRoutes;
}
