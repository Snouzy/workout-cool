import React from "react";

import { generateStructuredData, StructuredDataScript } from "@/shared/lib/structured-data";
import { getServerUrl } from "@/shared/lib/server-url";
import { SiteConfig } from "@/shared/config/site-config";

import type { Metadata } from "next";

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
    type: "Article" | "SoftwareApplication";
    author?: string;
    datePublished?: string;
    dateModified?: string;
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
  const fullTitle = title ? `${title} | ${SiteConfig.title}` : SiteConfig.title;
  const finalDescription = description || SiteConfig.description;
  const finalCanonical = canonical || baseUrl;
  const finalOgImage = ogImage || `${baseUrl}/images/default-og-image_${locale === "zh-CN" ? "zh" : locale}.jpg`;
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
        "zh-CN": `${baseUrl}/zh-CN`,
        "x-default": baseUrl,
      },
    },
    openGraph: {
      title: fullTitle,
      description: finalDescription,
      url: finalCanonical,
      siteName: SiteConfig.title,
      locale: locale === "en" ? "en_US" : locale === "es" ? "es_ES" : locale === "pt" ? "pt_PT" : locale === "ru" ? "ru_RU" : locale === "zh-CN" ? "zh_CN" : "fr_FR",
      alternateLocale: [
        "fr_FR", "fr_CA", "fr_CH", "fr_BE",
        "en_US", "en_GB", "en_CA", "en_AU", 
        "es_ES", "es_MX", "es_AR", "es_CL",
        "pt_PT", "pt_BR",
        "ru_RU", "ru_BY", "ru_KZ",
        "zh_CN", "zh_TW", "zh_HK"
      ].filter(alt => alt !== (locale === "en" ? "en_US" : locale === "es" ? "es_ES" : locale === "pt" ? "pt_PT" : locale === "ru" ? "ru_RU" : locale === "zh-CN" ? "zh_CN" : "fr_FR")),
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
}

export function SEOScripts({ title, description, locale = "en", canonical, ogImage, structuredData, children }: SEOScriptsProps) {
  const baseUrl = getServerUrl();
  const finalCanonical = canonical || baseUrl;
  const finalOgImage = ogImage || `${baseUrl}/images/default-og-image_${locale === "zh-CN" ? "zh" : locale}.jpg`;

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
    });
  }

  return (
    <>
      {structuredDataObj && <StructuredDataScript data={structuredDataObj} />}
      {children}
    </>
  );
}
