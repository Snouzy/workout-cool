import { Metadata } from "next";

import { PremiumUpgradeCard } from "@/features/premium/ui/premium-upgrade-card";

export const metadata: Metadata = {
  title: "Premium Plans - Train freely, support the mission",
  description:
    "Join thousands of fitness enthusiasts who believe in open-source training freedom. Support our mission while unlocking advanced features.",
  keywords: ["premium", "fitness", "workout", "open-source", "subscription", "training"],
  openGraph: {
    title: "Premium Plans - Support the Workout.cool Mission 💪",
    description: "For passionate fitness enthusiasts who believe in open-source and training freedom. Core features always free!",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Premium Plans - Workout.cool",
    description: "Train freely, support the mission. Join the passionate fitness community!",
  },
};

export default function PremiumPage() {
  return (
    <div className="bg-white dark:bg-gray-950">
      {/* Main Content */}
      <div className="relative" data-section="pricing">
        <PremiumUpgradeCard />
      </div>

      {/* Mobile Sticky CTA */}
      {/* <MobileStickyCard /> */}
    </div>
  );
}
