import React from "react";

import type { Metadata } from "next";

import { generateStructuredData, StructuredDataScript } from "@/shared/lib/structured-data";
import { getServerUrl } from "@/shared/lib/server-url";
import { SiteConfig } from "@/shared/config/site-config";
import { getDefaultOgImagePath, getLocalizedMetadata } from "@/shared/config/localized-metadata";


interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  locale?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  noIndex?: boolean;
  structuredData?: {
    type: "Article" | "SoftwareApplication" | "Calculator";
    author?: string;
    datePublished?: string;
    dateModified?: string;
    calculatorData?: {
      calculatorType: "calorie" | "macro" | "bmi" | "heart-rate" | "heart-rate-zones" | "one-rep-max" | "rest-timer";
      inputFields: string[];
      outputFields: string[];
      formula?: string;
      accuracy?: string;
      targetAudience?: string[];
      relatedCalculators?: string[];
    };
  };
}

export function generateSEOMetadata({
  title,
  description,
  keywords = [],
  locale = "en",
  canonical,
  ogImage,
  ogType = "website",
  noIndex = false,
}: SEOHeadProps): Metadata {
  const baseUrl = getServerUrl();
  const ogLocale = getLocalizedMetadata(locale).languageTag.replace("-", "_");
  const fullTitle = title ? `${title}` : SiteConfig.title;
  const finalDescription = description || SiteConfig.description;
  const finalCanonical = canonical || baseUrl;
  const finalOgImage = ogImage || `${baseUrl}${getDefaultOgImagePath(locale)}`;
  const allKeywords = [...SiteConfig.keywords, ...keywords];

  return {
    title: fullTitle,
    description: finalDescription,
    keywords: allKeywords,
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-snippet": -1,
            "max-image-preview": "large",
            "max-video-preview": -1,
          },
        },
    alternates: {
      canonical: finalCanonical,
      languages: {
        "fr-FR": `${baseUrl}/fr`,
        "en-US": `${baseUrl}/en`,
        "es-ES": `${baseUrl}/es`,
        "pt-PT": `${baseUrl}/pt`,
        "ru-RU": `${baseUrl}/ru`,
        "sv": `${baseUrl}/sv`,
        "zh-CN": `${baseUrl}/zh-CN`,
        "x-default": baseUrl,
      },
    },
    openGraph: {
      title: fullTitle,
      description: finalDescription,
      url: finalCanonical,
      siteName: SiteConfig.title,
      locale: ogLocale,
      alternateLocale: [
        "fr_FR",
        "fr_CA",
        "fr_CH",
        "fr_BE",
        "en_US",
        "en_GB",
        "en_CA",
        "en_AU",
        "es_ES",
        "es_MX",
        "es_AR",
        "es_CL",
        "pt_PT",
        "pt_BR",
        "ru_RU",
        "ru_BY",
        "ru_KZ",
        "zh_CN",
        "zh_TW",
        "zh_HK",
        "sv_SE",
      ].filter((alt) => alt !== ogLocale),
      images: [
        {
          url: finalOgImage,
          width: SiteConfig.seo.ogImage.width,
          height: SiteConfig.seo.ogImage.height,
          alt: title || SiteConfig.title,
        },
      ],
      type: ogType,
    },
    twitter: {
      card: "summary_large_image",
      site: SiteConfig.seo.twitterHandle,
      creator: SiteConfig.seo.twitterHandle,
      title: fullTitle,
      description: finalDescription,
      images: [
        {
          url: finalOgImage,
          width: SiteConfig.seo.ogImage.width,
          height: SiteConfig.seo.ogImage.height,
          alt: title || SiteConfig.title,
        },
      ],
    },
  };
}

interface SEOScriptsProps extends SEOHeadProps {
  children?: React.ReactNode;
  // Add hreflang support
  hreflangPath?: string; // e.g., "/tools/heart-rate-zones"
}

export function SEOScripts({
  title,
  description,
  locale = "en",
  canonical,
  ogImage,
  structuredData,
  hreflangPath,
  children,
}: SEOScriptsProps) {
  const baseUrl = getServerUrl();
  const finalCanonical = canonical || baseUrl;
  const finalOgImage = ogImage || `${baseUrl}${getDefaultOgImagePath(locale)}`;

  let structuredDataObj;
  if (structuredData) {
    structuredDataObj = generateStructuredData({
      type: structuredData.type,
      locale,
      title,
      description,
      url: finalCanonical,
      image: finalOgImage,
      author: structuredData.author,
      datePublished: structuredData.datePublished,
      dateModified: structuredData.dateModified,
      calculatorData: structuredData.calculatorData,
    });
  }

  // Generate hreflang tags if path is provided
  const hreflangTags = hreflangPath ? (
    <>
      <link href={`${baseUrl}/en${hreflangPath}`} hrefLang="en" rel="alternate" />
      <link href={`${baseUrl}/es${hreflangPath}`} hrefLang="es" rel="alternate" />
      <link href={`${baseUrl}/fr${hreflangPath}`} hrefLang="fr" rel="alternate" />
      <link href={`${baseUrl}/pt${hreflangPath}`} hrefLang="pt" rel="alternate" />
      <link href={`${baseUrl}/ru${hreflangPath}`} hrefLang="ru" rel="alternate" />
      <link href={`${baseUrl}/sv${hreflangPath}`} hrefLang="sv" rel="alternate" />
      <link href={`${baseUrl}/zh-CN${hreflangPath}`} hrefLang="zh-CN" rel="alternate" />
      <link href={`${baseUrl}/en${hreflangPath}`} hrefLang="x-default" rel="alternate" />
    </>
  ) : null;

  return (
    <>
      {structuredDataObj && <StructuredDataScript data={structuredDataObj} />}
      {hreflangTags}
      {children}
    </>
  );
}
