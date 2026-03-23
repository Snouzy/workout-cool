import type { TFunction } from "locales/client";

export interface Sponsor {
  id: string;
  name: string;
  descriptionKey: string;
  logoUrl: string;
  url: string;
}

export interface TranslatedSponsor {
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
  "left-0": {
    id: "fitdistance",
    name: "Fitdistance",
    descriptionKey: "ads.sponsor_fitdistance",
    logoUrl: "/images/sponsorship/fd-with-padding.png",
    url: "https://fitdistance.io/en",
  },
  "right-0": {
    id: "nutripure",
    name: "Nutripure",
    descriptionKey: "ads.sponsor_nutripure",
    logoUrl: "/images/sponsorship/nutripure.png",
    url: "https://c3po.link/QVupuZ8DYw",
  },
  "left-1": {
    id: "nutri-and-co",
    name: "Nutri&Co",
    descriptionKey: "ads.sponsor_nutri_and_co",
    logoUrl: "/images/sponsorship/nutri-and-co.png",
    url: "https://www.nutri-and-co.com",
  },
};

function translateSponsor(sponsor: Sponsor, t: TFunction): TranslatedSponsor {
  return {
    ...sponsor,
    description: (t as (key: string) => string)(sponsor.descriptionKey),
  };
}

export function getSidebarSlots(side: "left" | "right", t: TFunction): (TranslatedSponsor | null)[] {
  return Array.from({ length: SIDEBAR_SLOT_COUNT }, (_, i) => {
    const sponsor = sponsors[`${side}-${i}`];
    return sponsor ? translateSponsor(sponsor, t) : null;
  });
}

export function getAllSlots(t: TFunction): (TranslatedSponsor | null)[] {
  return [...getSidebarSlots("left", t), ...getSidebarSlots("right", t)];
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
