"use client";

import { Check, X, Star, Target, InfinityIcon } from "lucide-react";

import { useI18n } from "locales/client";

interface Feature {
  name: string;
  free: boolean | string;
  supporter: boolean | string;
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
          name: "Exercise library access",
          free: "Basic",
          supporter: "Extended",
          premium: "Complete",
        },
        {
          name: "Custom exercise creation",
          free: false,
          supporter: "Limited",
          premium: "Unlimited",
        },
        {
          name: "Video tutorials",
          free: "Basic",
          supporter: "HD Quality",
          premium: "4K + Slow-mo",
        },
        {
          name: "Professional templates",
          free: false,
          supporter: "5 templates",
          premium: "All templates",
        },
      ],
    },
    {
      name: "Tracking & Analytics",
      features: [
        {
          name: "Workout history",
          free: "6 months",
          supporter: "Unlimited",
          premium: "Unlimited",
        },
        {
          name: "Progress statistics",
          free: "Basic",
          supporter: "Advanced",
          premium: "Professional",
        },
        {
          name: "Personal records tracking",
          free: false,
          supporter: true,
          premium: true,
        },
        {
          name: "Volume & progression analytics",
          free: false,
          supporter: true,
          premium: true,
        },
        {
          name: "Biomechanical analysis",
          free: false,
          supporter: false,
          premium: true,
        },
      ],
    },
    {
      name: "Programs & AI",
      features: [
        {
          name: "Pre-designed programs",
          free: false,
          supporter: "Basic programs",
          premium: "All programs",
        },
        {
          name: "AI coaching suggestions",
          free: false,
          supporter: false,
          premium: true,
        },
        {
          name: "Personalized recommendations",
          free: false,
          supporter: "Basic",
          premium: "Advanced AI",
        },
        {
          name: "Pro templates (Powerlifting, Bodybuilding)",
          free: false,
          supporter: false,
          premium: true,
        },
      ],
    },
    {
      name: "Community & Sharing",
      features: [
        {
          name: "Community access",
          free: "Public",
          supporter: "Supporter badge",
          premium: "VIP access",
        },
        {
          name: "Discord community",
          free: "Basic",
          supporter: "Priority",
          premium: "Private channels",
        },
        {
          name: "Monthly coaching sessions",
          free: false,
          supporter: false,
          premium: true,
        },
        {
          name: "Exclusive achievements",
          free: false,
          supporter: "Some",
          premium: "All",
        },
      ],
    },
    {
      name: "Data & Export",
      features: [
        {
          name: "Data export",
          free: "Basic CSV",
          supporter: "PDF + CSV",
          premium: "All formats",
        },
        {
          name: "API access",
          free: false,
          supporter: false,
          premium: true,
        },
        {
          name: "Custom themes",
          free: false,
          supporter: "5 themes",
          premium: "Unlimited",
        },
        {
          name: "Push notifications",
          free: false,
          supporter: true,
          premium: true,
        },
      ],
    },
    {
      name: "Support & Early Access",
      features: [
        {
          name: "Community support",
          free: true,
          supporter: true,
          premium: true,
        },
        {
          name: "Priority support",
          free: false,
          supporter: true,
          premium: true,
        },
        {
          name: "Early access to features",
          free: false,
          supporter: false,
          premium: true,
        },
        {
          name: "Beta testing access",
          free: false,
          supporter: false,
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
          <InfinityIcon className="w-4 h-4 text-[#00D4AA]" />
          <span className="text-xs font-medium text-[#00D4AA]">Unlimited</span>
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
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Detailed Feature Comparison</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Everything you need to know about what's included in each plan
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-4 gap-4 p-6">
                <div className="font-semibold text-gray-900 dark:text-white">Features</div>
                <div className="text-center">
                  <div className="font-bold text-gray-900 dark:text-white">Free</div>
                  <div className="text-sm text-gray-500">€0/month</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-[#FF6B35]">Supporter</div>
                  <div className="text-sm text-gray-500">€4.99/month</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-[#00D4AA]">Premium</div>
                  <div className="text-sm text-gray-500">€9.99/month</div>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {categories.map((category, categoryIndex) => (
                <div className="p-6" key={categoryIndex}>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    {category.name === "Core Functions (Always Free)" && <div className="w-2 h-2 bg-[#22C55E] rounded-full" />}
                    {category.name}
                  </h3>

                  <div className="space-y-3">
                    {category.features.map((feature, featureIndex) => (
                      <div className="grid grid-cols-4 gap-4 items-center py-2" key={featureIndex}>
                        <div className="text-sm text-gray-700 dark:text-gray-300">{feature.name}</div>
                        <div className="text-center">{renderFeatureValue(feature.free)}</div>
                        <div className="text-center">{renderFeatureValue(feature.supporter)}</div>
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
