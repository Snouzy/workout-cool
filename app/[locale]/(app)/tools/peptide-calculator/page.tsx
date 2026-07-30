import { Metadata } from "next";
import { Locale } from "locales/types";
import { getI18n } from "locales/server";

import { PeptideCalculatorClient } from "./ui/PeptideCalculatorClient";
import { SEOContentServer } from "./ui/components/SEOContentServer";
import { PEPTIDE_CALCULATOR_CONTENT, PEPTIDE_CALCULATOR_CONTENT_FALLBACK } from "./seo/page-content";
import { PEPTIDE_CALCULATOR_SEO } from "./seo/config";
import { DEFAULT_INPUT } from "./lib/presets";

import { getServerUrl } from "@/shared/lib/server-url";
import { env } from "@/env";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { generateSEOMetadata, SEOScripts } from "@/components/seo/SEOHead";
import { HorizontalBottomBanner, HorizontalTopBanner } from "@/components/ads";

const PATH = "/tools/peptide-calculator";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const seo = PEPTIDE_CALCULATOR_SEO[locale] || PEPTIDE_CALCULATOR_SEO.en;

  return generateSEOMetadata({
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    locale,
    canonical: `${getServerUrl()}/${locale}${PATH}`,
  });
}

export default async function PeptideCalculatorPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getI18n();
  const seo = PEPTIDE_CALCULATOR_SEO[locale] || PEPTIDE_CALCULATOR_SEO.en;
  const content = PEPTIDE_CALCULATOR_CONTENT[locale] ?? PEPTIDE_CALCULATOR_CONTENT_FALLBACK;
  const url = `${getServerUrl()}/${locale}${PATH}`;

  return (
    <>
      <SEOScripts canonical={url} description={seo.description} hreflangPath={PATH} locale={locale} title={seo.title} />

      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: seo.title,
              applicationCategory: "HealthApplication",
              operatingSystem: "Any",
              isAccessibleForFree: true,
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              author: { "@type": "Organization", name: "WorkoutCool", url: getServerUrl() },
              description: seo.description,
              inLanguage: locale,
              dateModified: new Date().toISOString().split("T")[0],
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: content.faq.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
              })),
            },
            {
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: seo.title,
              description: content.heroSubtitle,
              step: content.sections.slice(0, 4).map((section, index) => ({
                "@type": "HowToStep",
                position: index + 1,
                name: section.heading,
                text: section.lead,
              })),
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Tools", item: `${getServerUrl()}/${locale}/tools` },
                { "@type": "ListItem", position: 2, name: seo.title, item: url },
              ],
            },
          ]),
        }}
        type="application/ld+json"
      />

      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        {(env.NEXT_PUBLIC_TOP_PEPTIDE_BANNER_AD_SLOT || env.NEXT_PUBLIC_EZOIC_TOP_PEPTIDE_PLACEMENT_ID) && (
          <HorizontalTopBanner
            adSlot={env.NEXT_PUBLIC_TOP_PEPTIDE_BANNER_AD_SLOT}
            ezoicPlacementId={env.NEXT_PUBLIC_EZOIC_TOP_PEPTIDE_PLACEMENT_ID}
          />
        )}

        <div className="container relative z-10 mx-auto max-w-5xl px-2 py-6 sm:px-4">
          <PeptideCalculatorClient
            defaultInput={DEFAULT_INPUT}
            disclaimer={content.disclaimer}
            subtitle={content.heroSubtitle}
            title={t("tools.peptide-calculator.title")}
          />

          <SEOContentServer content={content} />

          <RelatedTools
            heading={t("tools.related_title")}
            tools={[
              { href: `/${locale}/tools/bmi-calculator`, label: t("tools.bmi-calculator.title") },
              { href: `/${locale}/tools/calorie-calculator`, label: t("tools.calorie-calculator.title") },
              { href: `/${locale}/tools/heart-rate-zones`, label: t("tools.heart-rate-calculator.title") },
            ]}
          />
        </div>

        {(env.NEXT_PUBLIC_BOTTOM_PEPTIDE_BANNER_AD_SLOT || env.NEXT_PUBLIC_EZOIC_BOTTOM_PEPTIDE_PLACEMENT_ID) && (
          <HorizontalBottomBanner
            adSlot={env.NEXT_PUBLIC_BOTTOM_PEPTIDE_BANNER_AD_SLOT}
            ezoicPlacementId={env.NEXT_PUBLIC_EZOIC_BOTTOM_PEPTIDE_PLACEMENT_ID}
          />
        )}
      </div>
    </>
  );
}
