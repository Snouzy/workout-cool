export interface Sponsor {
  id: string;
  name: string;
  descriptionKey: string;
  logoUrl: string;
  url: string;
  brandColor?: string;
}

const SIDEBAR_SLOT_COUNT = 6;

/**
 * Hardcoded sponsor configuration.
 * Add sponsors here when they sign up.
 * Key format: "{position}-{index}" (e.g., "left-0", "right-2")
 */
const sponsors: Record<string, Sponsor> = {
  "left-0": {
    id: "fitdistance",
    name: "Fitdistance",
    descriptionKey: "ads.sponsor_fitdistance",
    logoUrl: "/images/sponsorship/fd-with-padding.png",
    url: "https://fitdistance.io/en",
    brandColor: "#F97316",
  },
  "right-0": {
    id: "nutripure",
    name: "Nutripure",
    descriptionKey: "ads.sponsor_nutripure",
    logoUrl: "/images/sponsorship/nutripure.png",
    url: "https://www.nutripure.fr/fr/?utm_source=affilae&utm_medium=affiliation&utm_campaign=Fit'Distance&ae=1038",
    brandColor: "#6BA4A0",
  },
  "left-1": {
    id: "nutri-and-co",
    name: "Nutri&Co",
    descriptionKey: "ads.sponsor_nutri_and_co",
    logoUrl: "/images/sponsorship/nutri-and-co.png",
    url: "https://nutriandco.com/fr/?utm_source=affilae&utm_medium=par&utm_campaign=fit-distance&ae=1253",
    brandColor: "#1A2F3B",
  },
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
