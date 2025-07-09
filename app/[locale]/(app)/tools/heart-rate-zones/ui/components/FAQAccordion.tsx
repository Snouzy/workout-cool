"use client";

import React, { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden"
          itemProp="mainEntity"
          itemScope
          itemType="https://schema.org/Question"
          key={index}
        >
          <button
            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setActiveTab(activeTab === index ? -1 : index)}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4" itemProp="name">
              {item.question}
            </h3>
            <span className="text-2xl text-gray-500">{activeTab === index ? "−" : "+"}</span>
          </button>
          {activeTab === index && (
            <div
              className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50"
              itemProp="acceptedAnswer"
              itemScope
              itemType="https://schema.org/Answer"
            >
              <p className="text-gray-700 dark:text-gray-300" itemProp="text">
                {item.answer}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}