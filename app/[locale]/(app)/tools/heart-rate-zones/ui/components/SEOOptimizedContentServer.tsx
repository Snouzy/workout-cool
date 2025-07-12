import React from "react";
import Link from "next/link";

import { getI18n } from "locales/server";
import { ScrollToTopButton } from "app/[locale]/(app)/tools/heart-rate-zones/ui/components/ScrollToTopButton";
import { FAQAccordion } from "app/[locale]/(app)/tools/heart-rate-zones/ui/components/FAQAccordion";
import { env } from "@/env";
import { InArticle } from "@/components/ads";

export async function SEOOptimizedContentServer() {
  const t = await getI18n();
  // Age-based heart rate chart data
  const ageChartData = [
    { age: "20-29", maxHR: "190-200", target50: "95-100", target85: "162-170" },
    { age: "30-39", maxHR: "180-190", target50: "90-95", target85: "153-162" },
    { age: "40-49", maxHR: "170-180", target50: "85-90", target85: "145-153" },
    { age: "50-59", maxHR: "160-170", target50: "80-85", target85: "136-145" },
    { age: "60-69", maxHR: "150-160", target50: "75-80", target85: "128-136" },
    { age: "70+", maxHR: "140-150", target50: "70-75", target85: "119-128" },
  ];

  const faqItems = [
    {
      question: t("tools.heart-rate-zones.seo_faq_q1_question"),
      answer: t("tools.heart-rate-zones.seo_faq_q1_answer"),
    },
    {
      question: t("tools.heart-rate-zones.seo_faq_q2_question"),
      answer: t("tools.heart-rate-zones.seo_faq_q2_answer"),
    },
    {
      question: t("tools.heart-rate-zones.seo_faq_q3_question"),
      answer: t("tools.heart-rate-zones.seo_faq_q3_answer"),
    },
    {
      question: t("tools.heart-rate-zones.seo_faq_q4_question"),
      answer: t("tools.heart-rate-zones.seo_faq_q4_answer"),
    },
    {
      question: t("tools.heart-rate-zones.seo_faq_q5_question"),
      answer: t("tools.heart-rate-zones.seo_faq_q5_answer"),
    },
    {
      question: t("tools.heart-rate-zones.seo_faq_q6_question"),
      answer: t("tools.heart-rate-zones.seo_faq_q6_answer"),
    },
    {
      question: t("tools.heart-rate-zones.seo_faq_q7_question"),
      answer: t("tools.heart-rate-zones.seo_faq_q7_answer"),
    },
    {
      question: t("tools.heart-rate-zones.seo_faq_q8_question"),
      answer: t("tools.heart-rate-zones.seo_faq_q8_answer"),
    },
  ];

  return (
    <div className="space-y-12 mt-16">
      {/* Introduction détaillée */}
      <section className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-3 sm:p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">{t("tools.heart-rate-zones.guide.title")}</h2>
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{t("tools.heart-rate-zones.guide.text1")}</p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">{t("tools.heart-rate-zones.guide.text2")}</p>
        </div>
      </section>
      {env.NEXT_PUBLIC_IN_ARTICLE_HEART_ZONES_AD_SLOT_1 && <InArticle adSlot={env.NEXT_PUBLIC_IN_ARTICLE_HEART_ZONES_AD_SLOT_1} />}

      {/* Tableau de référence par âge */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">{t("tools.heart-rate-zones.table.title")}</h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left">{t("tools.heart-rate-zones.table.col1")}</th>
                <th className="px-6 py-4 text-left">{t("tools.heart-rate-zones.table.col2")}</th>
                <th className="px-6 py-4 text-left">{t("tools.heart-rate-zones.table.col3")}</th>
                <th className="px-6 py-4 text-left">{t("tools.heart-rate-zones.table.col4")}</th>
              </tr>
            </thead>
            <tbody>
              {ageChartData.map((row, index) => (
                <tr className={index % 2 === 0 ? "bg-gray-50 dark:bg-gray-700" : "bg-white dark:bg-gray-800"} key={row.age}>
                  <td className="px-6 py-4 font-semibold">{row.age}</td>
                  <td className="px-6 py-4">{row.maxHR}</td>
                  <td className="px-6 py-4">{row.target50}</td>
                  <td className="px-6 py-4">{row.target85}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">{t("tools.heart-rate-zones.table.avertiser")}</p>
      </section>

      {/* Explication détaillée des zones */}
      <section className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-3 sm:p-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">{t("tools.heart-rate-zones.details.title")}</h2>

        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🚶</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-2">
                  {t("tools.heart-rate-zones.details.zone1_title")}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">{t("tools.heart-rate-zones.details.zone1_content")}</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      {t("tools.heart-rate-zones.details.benefits")} :
                    </h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>{t("tools.heart-rate-zones.details.zone1_details_1")}</li>
                      <li>{t("tools.heart-rate-zones.details.zone1_details_2")}</li>
                      <li>{t("tools.heart-rate-zones.details.zone1_details_3")}</li>
                      <li>{t("tools.heart-rate-zones.details.zone1_details_4")}</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      {t("tools.heart-rate-zones.details.zone1_duration")} :
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t("tools.heart-rate-zones.details.zone1_duration_value")}
                      <br />
                      {t("tools.heart-rate-zones.details.zone1_duration_value_2")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🔥</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-2">
                  {t("tools.heart-rate-zones.details.zone2_title")}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">{t("tools.heart-rate-zones.details.zone2_content")}</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      {t("tools.heart-rate-zones.details.benefits")} :
                    </h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>{t("tools.heart-rate-zones.details.zone2_details_1")}</li>
                      <li>{t("tools.heart-rate-zones.details.zone2_details_2")}</li>
                      <li>{t("tools.heart-rate-zones.details.zone2_details_3")}</li>
                      <li>{t("tools.heart-rate-zones.details.zone2_details_4")}</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      {t("tools.heart-rate-zones.details.zone2_duration")} :
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t("tools.heart-rate-zones.details.zone2_duration_value")}
                      <br />
                      {t("tools.heart-rate-zones.details.zone2_duration_value_2")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🏃</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-yellow-700 dark:text-yellow-300 mb-2">
                  {t("tools.heart-rate-zones.details.zone3_title")}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">{t("tools.heart-rate-zones.details.zone3_content")}</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      {t("tools.heart-rate-zones.details.benefits")} :
                    </h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>{t("tools.heart-rate-zones.details.zone3_details_1")}</li>
                      <li>{t("tools.heart-rate-zones.details.zone3_details_2")}</li>
                      <li>{t("tools.heart-rate-zones.details.zone3_details_3")}</li>
                      <li>{t("tools.heart-rate-zones.details.zone3_details_4")}</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      {t("tools.heart-rate-zones.details.zone3_duration")} :
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t("tools.heart-rate-zones.details.zone3_duration_value")}
                      <br />
                      {t("tools.heart-rate-zones.details.zone3_duration_value_2")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="text-4xl">💪</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-orange-700 dark:text-orange-300 mb-2">
                  {t("tools.heart-rate-zones.details.zone4_title")}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">{t("tools.heart-rate-zones.details.zone4_content")}</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      {t("tools.heart-rate-zones.details.benefits")} :
                    </h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>{t("tools.heart-rate-zones.details.zone4_details_1")}</li>
                      <li>{t("tools.heart-rate-zones.details.zone4_details_2")}</li>
                      <li>{t("tools.heart-rate-zones.details.zone4_details_3")}</li>
                      <li>{t("tools.heart-rate-zones.details.zone4_details_4")}</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      {t("tools.heart-rate-zones.details.zone4_duration")} :
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t("tools.heart-rate-zones.details.zone4_duration_value")}
                      <br />
                      {t("tools.heart-rate-zones.details.zone4_duration_value_2")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🚀</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-red-700 dark:text-red-300 mb-2">
                  {t("tools.heart-rate-zones.details.zone5_title")}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">{t("tools.heart-rate-zones.details.zone5_content")}</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      {t("tools.heart-rate-zones.details.benefits")} :
                    </h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>{t("tools.heart-rate-zones.details.zone5_details_1")}</li>
                      <li>{t("tools.heart-rate-zones.details.zone5_details_2")}</li>
                      <li>{t("tools.heart-rate-zones.details.zone5_details_3")}</li>
                      <li>{t("tools.heart-rate-zones.details.zone5_details_4")}</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      {t("tools.heart-rate-zones.details.zone5_duration")} :
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t("tools.heart-rate-zones.details.zone5_duration_value")}
                      <br />
                      {t("tools.heart-rate-zones.details.zone5_duration_value_2")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {env.NEXT_PUBLIC_IN_ARTICLE_HEART_ZONES_AD_SLOT_2 && <InArticle adSlot={env.NEXT_PUBLIC_IN_ARTICLE_HEART_ZONES_AD_SLOT_2} />}
      {/* Conseils d'entraînement */}
      <section className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl p-3 sm:p-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">{t("tools.heart-rate-zones.training_tips.title")}</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            { icon: "🔥", tip: "tip1" },
            { icon: "📊", tip: "tip2" },
            { icon: "🔄", tip: "tip3" },
            { icon: "💧", tip: "tip4" },
            { icon: "😴", tip: "tip5" },
            { icon: "📈", tip: "tip6" },
          ].map((item) => (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow" key={item.tip}>
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                {t(`tools.heart-rate-zones.training_tips.${item.tip}.title` as keyof typeof t)}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t(`tools.heart-rate-zones.training_tips.${item.tip}.description` as keyof typeof t)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ complète avec schema */}
      <section className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-3 sm:p-8" itemScope itemType="https://schema.org/FAQPage">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">{t("tools.heart-rate-zones.seo_faq_title")}</h2>

        {/* JSON-LD FAQ Schema for better Google indexing */}
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqItems.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: item.answer,
                },
              })),
            }),
          }}
          type="application/ld+json"
        />

        <FAQAccordion items={faqItems} />
      </section>

      {/* Liens internes et CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">{t("tools.heart-rate-zones.intern_links_title")}</h2>
          <p className="text-xl mb-8 opacity-90">{t("tools.heart-rate-zones.intern_links_subtitle")}</p>
          <ScrollToTopButton text={t("tools.heart-rate-zones.intern_links_button")} />

          <div className="mt-12 grid md:grid-cols-2 gap-6 text-left">
            <Link
              className="block bg-white/10 backdrop-blur rounded-2xl p-6 hover:bg-white/20 transition-colors"
              href="/tools/bmi-calculator"
            >
              <h3 className="font-bold text-lg mb-2">{t("tools.heart-rate-zones.intern_links_bmi_title")}</h3>
              <p className="opacity-90">{t("tools.heart-rate-zones.intern_links_bmi_description")}</p>
            </Link>
            <Link
              className="block bg-white/10 backdrop-blur rounded-2xl p-6 hover:bg-white/20 transition-colors"
              href="/tools/calorie-calculator"
            >
              <h3 className="font-bold text-lg mb-2">{t("tools.heart-rate-zones.intern_links_calorie_title")}</h3>
              <p className="opacity-90">{t("tools.heart-rate-zones.intern_links_calorie_description")}</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Avertissement médical */}
      <section className="bg-yellow-50 dark:bg-yellow-900/20 rounded-3xl p-6 border-2 border-yellow-200 dark:border-yellow-800">
        <div className="flex items-start gap-4">
          <span className="text-3xl">⚠️</span>
          <div>
            <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">{t("tools.heart-rate-zones.medical_warning_title")}</h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm">{t("tools.heart-rate-zones.medical_warning_content")}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
