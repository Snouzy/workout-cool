"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { useI18n } from "locales/client";

export function PricingFAQ() {
  const t = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqItems = [
    {
      question: t("premium.faq.items.0.question"),
      answer: t("premium.faq.items.0.answer"),
    },
    {
      question: t("premium.faq.items.1.question"),
      answer: t("premium.faq.items.1.answer"),
    },
    {
      question: t("premium.faq.items.2.question"),
      answer: t("premium.faq.items.2.answer"),
    },
    {
      question: t("premium.faq.items.3.question"),
      answer: t("premium.faq.items.3.answer"),
    },
    {
      question: t("premium.faq.items.4.question"),
      answer: t("premium.faq.items.4.answer"),
    },
    {
      question: t("premium.faq.items.5.question"),
      answer: t("premium.faq.items.5.answer"),
    },
    {
      question: t("premium.faq.items.6.question"),
      answer: t("premium.faq.items.6.answer"),
    },
    {
      question: t("premium.faq.items.7.question"),
      answer: t("premium.faq.items.7.answer"),
    },
    {
      question: t("premium.faq.items.8.question"),
      answer: t("premium.faq.items.8.answer"),
    },
    {
      question: t("premium.faq.items.9.question"),
      answer: t("premium.faq.items.9.answer"),
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{t("premium.faq.title")}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{t("premium.faq.subtitle")}</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div
                className="bg-slate-100 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                key={index}
              >
                <button
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-400 dark:hover:bg-gray-800 transition-colors duration-200"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="text-lg sm:text-xl leading-tight font-semibold text-gray-900 dark:text-white pr-4">{item.question}</span>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>

                {openIndex === index && (
                  <div className="px-6 pb-4">
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <p className="text-gray-700 dark:text-gray-400 leading-relaxed">{item.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Additional Support */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-[#FF6B35]/10 to-[#00D4AA]/10 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t("premium.faq.additional_support.title")}</h3>
              <p className="text-gray-700 dark:text-gray-400 mb-4">{t("premium.faq.additional_support.description")}</p>
              <div className="flex items-start sm:items-center justify-center gap-4 text-sm text-gray-600 flex-col">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#22C55E] rounded-full" />
                  <span className="block text-left sm:flex">{t("premium.faq.additional_support.community")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#FF6B35] rounded-full" />
                  <span className="block text-left sm:flex">{t("premium.faq.additional_support.discussions")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#00D4AA] rounded-full" />
                  <span className="block text-left sm:flex">{t("premium.faq.additional_support.roadmap")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
