export interface Sponsor {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  url: string;
}

const SIDEBAR_SLOT_COUNT = 6;

/**
 * Hardcoded sponsor configuration.
 * Add sponsors here when they sign up.
 * Key format: "{position}-{index}" (e.g., "left-0", "right-2")
 */
const sponsors: Record<string, Sponsor> = {
  // Example:
  // "right-3": {
  //   id: "superx",
  //   name: "SuperX",
  //   description: "Grow faster on X with hidden insights smart analytics",
  //   logoUrl: "/images/sponsors/superx.png",
  //   url: "https://superx.so",
  // },
};

export function getSidebarSlots(side: "left" | "right"): (Sponsor | null)[] {
  return Array.from({ length: SIDEBAR_SLOT_COUNT }, (_, i) => sponsors[`${side}-${i}`] ?? null);
}

export function getAllSlots(): (Sponsor | null)[] {
  return [...getSidebarSlots("left"), ...getSidebarSlots("right")];
}

export const audienceStats = {
  totalVisits: "657,910",
  totalVisitsGrowth: "+15.82%",
  desktopPageViews: "399,805",
  desktopPageViewsGrowth: "+19.17%",
  mobilePageViews: "1.003M",
  mobilePageViewsGrowth: "+3.92%",
  deviceDesktop: "27.53%",
  deviceMobile: "72.47%",
  uniqueVisitors: "304,133",
  uniqueVisitorsGrowth: "+38.55%",
  topCountries: [
    "Mexico",
    "India",
    "Russia",
    "United States",
    "United Kingdom",
    "Germany",
    "Canada",
    "Philippines",
    "Spain",
    "Bangladesh",
    "France",
    "Brazil",
    "Australia",
    "Italy",
  ],
  genderMale: 69.73,
  genderFemale: 30.27,
  ageDistribution: [
    { range: "18-24", percent: 22.05 },
    { range: "25-34", percent: 26.93 },
    { range: "35-44", percent: 20.84 },
    { range: "45-54", percent: 15.12 },
    { range: "55-64", percent: 9.62 },
    { range: "65+", percent: 5.44 },
  ],
  pricing: "700€",
};
