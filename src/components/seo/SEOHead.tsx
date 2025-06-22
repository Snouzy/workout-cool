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
  locale = "fr",
  canonical,
  ogImage,
  ogType = "website",
  noIndex = false,
}: SEOHeadProps): Metadata {
  const baseUrl = getServerUrl();
  const fullTitle = title ? `${title} | ${SiteConfig.title}` : SiteConfig.title;
  const finalDescription = description || SiteConfig.description;
  const finalCanonical = canonical || baseUrl;
  const finalOgImage = ogImage || `${baseUrl}/images/default-og-image_${locale}.jpg`;
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
        "x-default": baseUrl,
      },
    },
    openGraph: {
      title: fullTitle,
      description: finalDescription,
      url: finalCanonical,
      siteName: SiteConfig.title,
      images: [
        {
          url: finalOgImage,
          width: SiteConfig.seo.ogImage.width,
          height: SiteConfig.seo.ogImage.height,
          alt: title || SiteConfig.title,
        },
      ],
      locale: locale === "en" ? "en_US" : "fr_FR",
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

export function SEOScripts({ title, description, locale = "fr", canonical, ogImage, structuredData, children }: SEOScriptsProps) {
  const baseUrl = getServerUrl();
  const finalCanonical = canonical || baseUrl;
  const finalOgImage = ogImage || `${baseUrl}/images/default-og-image_${locale}.jpg`;

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
