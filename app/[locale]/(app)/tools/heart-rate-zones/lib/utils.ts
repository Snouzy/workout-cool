import { TFunction } from "locales/client";

interface HeartRateZone {
  name: string;
  minHR: number;
  maxHR: number;
  emoji: string;
  color: string;
  bgColor: string;
  description: string;
}

interface HeartRateResults {
  maxHeartRate: number;
  zones: HeartRateZone[];
}

export function calculateHeartRateZones(age: number, t: TFunction): HeartRateResults {
  // Calculate MHR
  const maxHeartRate = 220 - age;

  // Simple zones with emojis and colors
  const zones: HeartRateZone[] = [
    {
      name: t("tools.heart-rate-zones.zones.warm_up.name"),
      minHR: Math.round(maxHeartRate * 0.5),
      maxHR: Math.round(maxHeartRate * 0.6),
      emoji: "🚶",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      description: t("tools.heart-rate-zones.zones.warm_up.description"),
    },
    {
      name: t("tools.heart-rate-zones.zones.fat_burn.name"),
      minHR: Math.round(maxHeartRate * 0.6),
      maxHR: Math.round(maxHeartRate * 0.7),
      emoji: "🔥",
      color: "text-green-600",
      bgColor: "bg-green-100",
      description: t("tools.heart-rate-zones.zones.fat_burn.description"),
    },
    {
      name: t("tools.heart-rate-zones.zones.aerobic.name"),
      minHR: Math.round(maxHeartRate * 0.7),
      maxHR: Math.round(maxHeartRate * 0.8),
      emoji: "🏃",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      description: t("tools.heart-rate-zones.zones.aerobic.description"),
    },
    {
      name: t("tools.heart-rate-zones.zones.anaerobic.name"),
      minHR: Math.round(maxHeartRate * 0.8),
      maxHR: Math.round(maxHeartRate * 0.9),
      emoji: "💪",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      description: t("tools.heart-rate-zones.zones.anaerobic.description"),
    },
    {
      name: t("tools.heart-rate-zones.zones.vo2_max.name"),
      minHR: Math.round(maxHeartRate * 0.9),
      maxHR: maxHeartRate,
      emoji: "🚀",
      color: "text-red-600",
      bgColor: "bg-red-100",
      description: t("tools.heart-rate-zones.zones.vo2_max.description"),
    },
  ];

  return {
    maxHeartRate,
    zones,
  };
}
