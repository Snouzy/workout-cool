"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { useI18n } from "locales/client";

interface FAQItem {
  question: string;
  answer: string;
}

export function PricingFAQ() {
  const t = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqItems: FAQItem[] = [
    {
      question: "Why pay if it's open-source?",
      answer:
        "Excellent question! The code will always remain free, but maintaining servers, database and infrastructure costs money. Your contribution helps us keep the tool free for everyone. It's a win-win model: you get premium features, the community keeps free access!",
    },
    {
      question: "Can I self-host Workout.cool?",
      answer:
        "Absolutely! The entire codebase is available on GitHub under MIT license. You can deploy it on your own servers, customize it however you want, and use it completely free. Self-hosting gives you full control over your data and workout privacy.",
    },
    {
      question: "Are my workout data secure?",
      answer:
        "Yes! We're GDPR compliant, use encrypted connections, and store your data securely. Plus, since we're open-source, you can audit our security practices. You can also export your data anytime or self-host for complete control.",
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer:
        "Of course! No contracts, no commitments. Cancel with one click anytime. You'll keep access until your current billing period ends, and you can always restart later. Your workout data remains accessible even if you downgrade to free.",
    },
    {
      question: "Are there exercises for beginners?",
      answer:
        "Definitely! Our exercise library covers all fitness levels from complete beginners to advanced athletes. Videos and instructions help beginners find appropriate exercises, and our video tutorials show proper form.",
    },
    {
      question: "How does progress tracking work?",
      answer:
        "Every set, rep, weight, and time is automatically logged. You get a GitHub-style workout history showing your consistency, plus detailed analytics on volume, progression, and personal records. Premium users get advanced charts and insights.",
    },
    {
      question: "Can I import data from other apps?",
      answer:
        "Soon. We will support CSV imports for basic data (reps & weight). If you're switching from another fitness app, our support team can help migrate your workout history.",
    },
    {
      question: "Does the app work offline?",
      answer:
        "The core workout tracking works offline. You can log sets and reps without internet connection for 10 workouts. Exercise videos and cloud sync require internet connection. All your offline data syncs automatically when you're back online.",
    },
    {
      question: "Are there programs for women?",
      answer:
        "Absolutely! And there will be more programs in the future. We are working on it. Supporter and Premium plans will include all the future specialized programs for different goals: strength, toning, powerlifting, bodybuilding, and more !",
    },
    {
      question: "Can I create my own programs?",
      answer: "Unfortunately, no. We are working on it !",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Everything you need to know about Workout.cool and our mission
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div
                className="bg-slate-100 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                key={index}
              >
                <button
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="text-lg font-semibold text-gray-900 dark:text-white pr-4">{item.question}</span>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>

                {openIndex === index && (
                  <div className="px-6 pb-4">
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Additional Support */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-[#FF6B35]/10 to-[#00D4AA]/10 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Still have questions?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Our fitness-focused community is here to help you succeed</p>
              <div className="flex items-start sm:items-center justify-center gap-4 text-sm text-gray-500 flex-col">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-[#22C55E] rounded-full" />
                  <span className="block text-left sm:flex">Community support (discord or hello@workout.cool)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-[#FF6B35] rounded-full" />
                  <span className="block text-left sm:flex">Open discussions (github/discord)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-[#00D4AA] rounded-full" />
                  <span className="block text-left sm:flex">Transparent roadmap (github)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
