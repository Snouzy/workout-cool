"use client";

import { Check, X, Star, Target } from "lucide-react";

import { useI18n } from "locales/client";

interface Feature {
  name: string;
  free: boolean | string;
  premium: boolean | string;
}

interface FeatureCategory {
  name: string;
  features: Feature[];
}

export function FeatureComparisonTable() {
  const t = useI18n();

  const categories: FeatureCategory[] = [
    {
      name: "Equipment & Exercises",
      features: [
        {
          name: "Exercise library",
          free: "Basic",
          premium: "Complete",
        },
        {
          name: "Custom exercise",
          free: false,
          premium: "Unlimited",
        },
        {
          name: "Video tutorials",
          free: "Basic",
          premium: "4K + Slow-mo",
        },
      ],
    },
    {
      name: "Tracking & Analytics",
      features: [
        {
          name: "Workout history",
          free: "6 months",
          premium: "Unlimited",
        },
        {
          name: "Progress statistics",
          free: false,
          premium: "Professional",
        },
        {
          name: "Personal records tracking",
          free: false,
          premium: true,
        },
        {
          name: "Volume & progression analytics",
          free: false,
          premium: true,
        },
      ],
    },
    {
      name: "Programs & AI",
      features: [
        {
          name: "Pre-designed programs",
          free: "Limited",
          premium: "All programs",
        },
        {
          name: "Personalized recommendations",
          free: false,
          premium: true,
        },
        {
          name: "Pro templates (Powerlifting, bodybuilding, etc.)",
          free: false,
          premium: "Soon",
        },
      ],
    },
    {
      name: "Community & Sharing",
      features: [
        {
          name: "Community access",
          free: "Public",
          premium: "VIP access",
        },
        {
          name: "Discord community",
          free: "Basic",
          premium: "Private channels",
        },
        {
          name: "Private 1:1 chat with coach",
          free: false,
          premium: true,
        },
      ],
    },
    {
      name: "Support & Project",
      features: [
        {
          name: "Community support",
          free: true,
          premium: true,
        },
        {
          name: "Priority support",
          free: false,
          premium: true,
        },
        {
          name: "Early access to features",
          free: false,
          premium: true,
        },
        {
          name: "Beta testing access",
          free: false,
          premium: true,
        },
      ],
    },
  ];

  const renderFeatureValue = (value: boolean | string) => {
    if (value === true) {
      return <Check className="w-5 h-5 text-[#22C55E] mx-auto" />;
    }
    if (value === false) {
      return <X className="w-5 h-5 text-gray-400 mx-auto" />;
    }
    if (value === "Unlimited") {
      return (
        <div className="flex items-center justify-center gap-1">
          <span className="text-xs font-medium text-[#00D4AA]">∞ Unlimited</span>
        </div>
      );
    }
    if (typeof value === "string" && value.includes("templates")) {
      return (
        <div className="flex items-center justify-center gap-1">
          <Star className="w-4 h-4 text-[#F59E0B]" />
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{value}</span>
        </div>
      );
    }
    if (typeof value === "string" && (value.includes("Early") || value.includes("Beta"))) {
      return (
        <div className="flex items-center justify-center gap-1">
          <Target className="w-4 h-4 text-[#FF6B35]" />
          <span className="text-xs font-medium text-[#FF6B35]">Early Access</span>
        </div>
      );
    }
    return <span className="text-center text-xs font-medium text-gray-700 dark:text-gray-300">{value}</span>;
  };

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Detailed Feature Comparison</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Everything you need to know about what's included in each plan
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-3 gap-4 p-6">
                <div className="font-semibold text-gray-900 dark:text-white">Features</div>
                <div className="text-center">
                  <div className="font-bold text-gray-900 dark:text-white">Free</div>
                  <div className="text-sm text-gray-500">€0/forever</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-[#00D4AA]">Premium</div>
                  <div className="text-sm text-gray-500">€7.90/month or €49/year</div>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {categories.map((category, categoryIndex) => (
                <div className="p-3 sm:p-6" key={categoryIndex}>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">{category.name}</h3>

                  <div className="space-y-3">
                    {category.features.map((feature, featureIndex) => (
                      <div className="grid grid-cols-3 gap-4 items-center py-2" key={featureIndex}>
                        <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">{feature.name}</div>
                        <div className="text-center">{renderFeatureValue(feature.free)}</div>
                        <div className="text-center">{renderFeatureValue(feature.premium)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
