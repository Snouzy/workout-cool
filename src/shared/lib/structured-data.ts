import React from "react";

import { getServerUrl } from "@/shared/lib/server-url";
import { SiteConfig } from "@/shared/config/site-config";

export interface StructuredDataProps {
  type: "WebSite" | "WebApplication" | "Organization" | "SoftwareApplication" | "Article";
  locale?: string;
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
}

export function generateStructuredData({
  type,
  locale = "fr",
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  author,
}: StructuredDataProps) {
  const baseUrl = getServerUrl();
  const isEnglish = locale === "en";

  const baseStructuredData = {
    "@context": "https://schema.org",
    "@type": type,
    url: url || baseUrl,
    name: title || SiteConfig.title,
    description: description || SiteConfig.description,
    inLanguage: locale === "en" ? "en-US" : "fr-FR",
    publisher: {
      "@type": "Organization",
      name: SiteConfig.company.name,
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
        width: 512,
        height: 512,
      },
    },
  };

  switch (type) {
    case "WebSite":
      return {
        ...baseStructuredData,
        "@type": "WebSite",
        potentialAction: {
          "@type": "SearchAction",
          target: `${baseUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
        sameAs: [SiteConfig.maker.twitter, `${baseUrl}`],
      };

    case "WebApplication":
      return {
        ...baseStructuredData,
        "@type": "WebApplication",
        applicationCategory: "HealthAndFitnessApplication",
        operatingSystem: "Web Browser",
        browserRequirements: "Requires JavaScript. Requires HTML5.",
        softwareVersion: "1.2.1",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        featureList: [
          isEnglish ? "Personalized workout builder" : "Créateur d'entraînement personnalisé",
          isEnglish ? "Comprehensive exercise database" : "Base de données d'exercices complète",
          isEnglish ? "Progress tracking" : "Suivi des progrès",
          isEnglish ? "Muscle group targeting" : "Ciblage des groupes musculaires",
          isEnglish ? "Equipment-based filtering" : "Filtrage par équipement",
        ],
      };

    case "Organization":
      return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: SiteConfig.company.name,
        url: baseUrl,
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/logo.png`,
          width: 512,
          height: 512,
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Paris",
          addressCountry: "FR",
          streetAddress: SiteConfig.company.address,
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+33-1-00-00-00-00",
          contactType: "customer service",
          availableLanguage: ["French", "English"],
        },
        sameAs: [SiteConfig.maker.twitter],
        foundingDate: "2024",
        description: isEnglish
          ? "Modern fitness coaching platform helping users create personalized workout routines"
          : "Plateforme moderne de coaching fitness aidant les utilisateurs à créer des routines d'entraînement personnalisées",
      };

    case "SoftwareApplication":
      return {
        ...baseStructuredData,
        "@type": "SoftwareApplication",
        applicationCategory: "HealthApplication",
        operatingSystem: "Web",
        downloadUrl: baseUrl,
        softwareVersion: "1.2.1",
        releaseNotes: isEnglish
          ? "Latest update includes improved exercise database and better user experience"
          : "La dernière mise à jour inclut une base de données d'exercices améliorée et une meilleure expérience utilisateur",
        screenshot: image || `${baseUrl}/images/default-og-image_${locale}.jpg`,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          ratingCount: "127",
        },
      };

    case "Article":
      return {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description: description,
        url: url,
        author: {
          "@type": "Person",
          name: author || SiteConfig.company.name,
        },
        publisher: {
          "@type": "Organization",
          name: SiteConfig.company.name,
          logo: {
            "@type": "ImageObject",
            url: `${baseUrl}/logo.png`,
            width: 512,
            height: 512,
          },
        },
        datePublished: datePublished || new Date().toISOString(),
        dateModified: dateModified || new Date().toISOString(),
        image: image || `${baseUrl}/images/default-og-image_${locale}.jpg`,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": url,
        },
      };

    default:
      return baseStructuredData;
  }
}

export function StructuredDataScript({ data }: { data: object }) {
  return React.createElement("script", {
    type: "application/ld+json",
    dangerouslySetInnerHTML: {
      __html: JSON.stringify(data),
    },
  });
}
