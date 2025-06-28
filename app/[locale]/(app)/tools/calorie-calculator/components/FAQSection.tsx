"use client";

import React, { useState } from "react";
import { ChevronDownIcon, HelpCircleIcon } from "lucide-react";

import { useI18n } from "locales/client";

export function FAQSection() {
  const t = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: t("tools.calorie-calculator.faq.q1"),
      answer: t("tools.calorie-calculator.faq.a1"),
    },
    {
      question: t("tools.calorie-calculator.faq.q2"),
      answer: t("tools.calorie-calculator.faq.a2"),
    },
    {
      question: t("tools.calorie-calculator.faq.q3"),
      answer: t("tools.calorie-calculator.faq.a3"),
    },
    {
      question: t("tools.calorie-calculator.faq.q4"),
      answer: t("tools.calorie-calculator.faq.a4"),
    },
  ];

  return (
    <div className="mt-12 bg-base-200/30 dark:bg-base-200/20 rounded-2xl border border-base-content/10 dark:border-base-content/5 p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-br from-[#4F8EF7]/20 to-[#238BE6]/10">
          <HelpCircleIcon className="w-6 h-6 text-[#4F8EF7]" />
        </div>
        <h2 className="text-2xl font-bold text-base-content dark:text-base-content/90">{t("tools.calorie-calculator.faq.title")}</h2>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            className="border border-base-content/10 dark:border-base-content/5 rounded-xl overflow-hidden transition-all duration-300 hover:border-primary/30 bg-base-100 dark:bg-base-400/20"
            key={index}
          >
            <button
              className="w-full p-4 text-left flex items-center justify-between gap-4 transition-colors hover:bg-base-200/50 dark:hover:bg-base-300/20"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <h3 className="font-semibold text-base-content dark:text-base-content/90">{faq.question}</h3>
              <ChevronDownIcon
                className={`w-5 h-5 text-base-content/60 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`}
              />
            </button>
            <div className={`px-4 transition-all duration-300 ${openIndex === index ? "pb-4" : "max-h-0 overflow-hidden"}`}>
              <p className="text-sm text-base-content/70 dark:text-base-content/60 leading-relaxed">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
