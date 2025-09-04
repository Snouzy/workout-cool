"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

import { AdWrapper } from "./AdWrapper";

const messageVariants = [
  // {
  //   title: "Nutrition sportive naturelle",
  //   description: "Des milliers de sportifs nous font confiance",
  //   cta: "Découvrir",
  //   badge: "🇫🇷 Made in France",
  //   socialProof: true,
  // },
  {
    title: "Whey protéine sans additifs",
    description: "100% traçable pour optimiser votre récupération",
    cta: "En savoir plus",
    badge: "⭐ 4.8/5 (1k+ avis)",
    socialProof: true,
  },
  {
    title: "Compléments haute qualité",
    description: "Multi-vitamines, Omega 3 et Magnésium pour athlètes",
    cta: "Explorer",
    badge: "🌿 100% Naturel",
  },
  {
    title: "Recommandé par les coachs",
    description: "La référence française en nutrition sportive naturelle",
    cta: "Voir les produits",
    badge: "🏆 Qualité premium",
    socialProof: true,
  },
];

interface NutripureAffiliateBannerProps {
  context?: "workout" | "nutrition" | "recovery" | "general";
  position?: "top" | "middle" | "bottom";
}

export function NutripureAffiliateBanner({ context = "general", position = "middle" }: NutripureAffiliateBannerProps) {
  const affiliateUrl = "https://c3po.link/QVupuZ8DYw";
  const [currentVariant, setCurrentVariant] = useState(0);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let filteredVariants = messageVariants;

    // Personnalisation selon le contexte
    if (context === "workout" || context === "recovery") {
      // Prioriser les messages avec protéines et récupération
      filteredVariants = messageVariants.filter((_, index) => [1, 3].includes(index));
    } else if (context === "nutrition") {
      // Prioriser les compléments et vitamines
      filteredVariants = messageVariants.filter((_, index) => [2, 3].includes(index));
    }

    // Pour le placement en haut, prioriser les messages avec preuve sociale
    if (position === "top") {
      const socialProofMessages = filteredVariants.filter((msg) => msg.socialProof);
      if (socialProofMessages.length > 0) {
        filteredVariants = socialProofMessages;
      }
    }

    const randomIndex = Math.floor(Math.random() * filteredVariants.length);
    const selectedMessage = filteredVariants[randomIndex];
    const originalIndex = messageVariants.indexOf(selectedMessage);
    setCurrentVariant(originalIndex);
  }, [context, position]);

  const message = messageVariants[currentVariant];

  return (
    <AdWrapper>
      <div
        className="w-full max-w-full"
        ref={bannerRef}
        style={{
          minHeight: "auto",
          width: "100%",
          maxHeight: "90px",
          height: "90px",
        }}
      >
        <div className="py-1 flex justify-center w-full">
          <div className="responsive-nutripure-container">
            <Link className="block w-full h-full" href={affiliateUrl} rel="noopener noreferrer sponsored" target="_blank">
              <div className="nutripure-banner">
                {/* Mobile Layout */}
                <div className="mobile-layout">
                  <div className="image-section">
                    <Image
                      alt="Nutripure"
                      className="object-contain max-h-[90%] ml-1"
                      fill
                      sizes="50px"
                      src="/images/nutripure-logo.webp"
                    />
                  </div>
                  <div className="content-section">
                    <div className="text-wrapper">
                      <span className="badge">{message.badge}</span>
                      <h4 className="title">{message.title}</h4>
                      <p className="description">{message.description}</p>
                    </div>
                    <span className="cta">{message.cta}</span>
                  </div>
                </div>

                {/* Tablet/Desktop Layout */}
                <div className="desktop-layout">
                  <div className="image-section">
                    <Image alt="Nutripure" className="object-contain p-2" fill sizes="90px" src="/images/nutripure-logo.webp" />
                  </div>
                  <div className="content-section">
                    <div className="badge-wrapper">
                      <span className="badge">{message.badge}</span>
                    </div>
                    <div className="text-content">
                      <h4 className="title">{message.title}</h4>
                      <p className="description">{message.description}</p>
                    </div>
                    <div className="cta-wrapper">
                      <span className="cta">
                        {message.cta}
                        <svg className="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .responsive-nutripure-container {
          width: 100%;
        }

        .nutripure-banner {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #000 0%, #b8e0ff 100%);
          border: 1px solid #000;
          border-radius: 0;
          overflow: hidden;
          transition: all 0.3s ease;
          position: relative;
          box-shadow: 0 4px 12px rgba(107, 182, 232, 0.25);
        }

        @media (prefers-color-scheme: dark) {
          .nutripure-banner {
            background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%);
            border: 1px solid #000;
            box-shadow: 0 2px 8px rgba(160, 211, 243, 0.2);
          }
        }

        .nutripure-banner:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(107, 182, 232, 0.35);
          border-color: #5aa5d7;
        }

        @media (prefers-color-scheme: dark) {
          .nutripure-banner:hover {
            box-shadow: 0 6px 16px rgba(160, 211, 243, 0.3);
            border-color: #a0d3f3;
          }
        }

        /* Mobile Layout (default) */
        .mobile-layout {
          display: flex;
          height: 100%;
          align-items: center;
          padding: 0;
        }

        .mobile-layout .image-section {
          position: relative;
          width: 50px;
          height: 80px;
          flex-shrink: 0;
          background: rgba(255, 255, 255, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px 0 0 8px;
        }

        .mobile-layout .content-section {
          flex: 1;
          padding: 8px 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .mobile-layout .text-wrapper {
          flex: 1;
          min-width: 0;
        }

        .mobile-layout .badge {
          display: inline-block;
          font-size: 10px;
          background: #1e3a5f;
          color: white;
          padding: 2px 5px;
          border-radius: 4px;
          font-weight: 600;
          margin-bottom: 3px;
          white-space: nowrap;
        }

        @media (prefers-color-scheme: dark) {
          .mobile-layout .badge {
            background: #000000;
          }
        }

        .mobile-layout .title {
          font-size: 13px;
          font-weight: 700;
          color: #1e3a5f;
          line-height: 1.2;
          margin-bottom: 2px;
        }

        @media (prefers-color-scheme: dark) {
          .mobile-layout .title {
            color: #000000;
          }
        }

        .mobile-layout .description {
          font-size: 11px;
          color: #2c4f70;
          line-height: 1.3;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        @media (prefers-color-scheme: dark) {
          .mobile-layout .description {
            color: #555555;
          }
        }

        .mobile-layout .cta {
          font-size: 12px;
          font-weight: 600;
          color: white;
          background: linear-gradient(135deg, #1e3a5f 0%, #2c4f70 100%);
          padding: 8px 12px;
          border-radius: 6px;
          white-space: nowrap;
          flex-shrink: 0;
          box-shadow: 0 2px 4px rgba(30, 58, 95, 0.2);
          position: relative;
          overflow: hidden;
        }

        .mobile-layout .cta::before {
          content: "";
          position: absolute;
          top: -50%;
          left: -100%;
          width: 200%;
          height: 200%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transform: rotate(45deg);
          animation: shine 3s infinite;
        }

        @keyframes shine {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }

        @media (prefers-color-scheme: dark) {
          .mobile-layout .cta {
            background: #a0d3f3;
            color: #000000;
            box-shadow: none;
          }
        }

        /* Tablet/Desktop Layout (hidden by default) */
        .desktop-layout {
          display: none;
        }

        /* Tablet styles */
        @media (min-width: 481px) and (max-width: 768px) {
          .responsive-nutripure-container {
            max-width: 100%;
            height: 90px;
          }

          .mobile-layout .image-section {
            width: 90px;
            height: 90px;
            background: rgba(255, 255, 255, 0.95);
          }

          .mobile-layout .title {
            font-size: 14px;
          }

          .mobile-layout .description {
            font-size: 12px;
          }

          .mobile-layout .badge {
            display: inline-block;
            font-size: 11px;
            background: #1e3a5f;
            color: white;
            padding: 3px 7px;
            border-radius: 6px;
            font-weight: 600;
          }

          @media (prefers-color-scheme: dark) {
            .mobile-layout .badge {
              background: #000000;
            }
          }

          .mobile-layout .cta {
            font-size: 13px;
            padding: 8px 14px;
            position: relative;
            overflow: hidden;
          }

          .mobile-layout .cta::after {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            transform: translate(-50%, -50%);
          }

          @media (prefers-color-scheme: dark) {
            .mobile-layout .cta {
              background: #a0d3f3;
              color: #000000;
            }
          }
        }

        /* Desktop styles */
        @media (min-width: 769px) {
          .responsive-nutripure-container {
            max-width: 728px;
            height: 90px;
          }

          .mobile-layout {
            display: none;
          }

          .desktop-layout {
            display: flex;
            height: 100%;
            align-items: center;
            padding: 0;
          }

          .desktop-layout .image-section {
            position: relative;
            width: 90px;
            height: 90px;
            flex-shrink: 0;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 10px 0 0 10px;
          }

          .desktop-layout .content-section {
            flex: 1;
            padding: 12px 16px;
            display: flex;
            align-items: center;
            gap: 16px;
          }

          .desktop-layout .badge-wrapper {
            flex-shrink: 0;
          }

          .desktop-layout .badge {
            font-size: 12px;
            background: #1e3a5f;
            color: white;
            padding: 5px 10px;
            border-radius: 8px;
            font-weight: 600;
            white-space: nowrap;
            box-shadow: 0 2px 6px rgba(30, 58, 95, 0.2);
          }

          @media (prefers-color-scheme: dark) {
            .desktop-layout .badge {
              background: #000000;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
          }

          .desktop-layout .text-content {
            flex: 1;
          }

          .desktop-layout .title {
            font-size: 16px;
            font-weight: 700;
            color: #1e3a5f;
            margin-bottom: 4px;
          }

          @media (prefers-color-scheme: dark) {
            .desktop-layout .title {
              color: #000000;
            }
          }

          .desktop-layout .description {
            font-size: 12px;
            color: #2c4f70;
            line-height: 1.4;
            font-weight: 400;
          }

          @media (prefers-color-scheme: dark) {
            .desktop-layout .description {
              color: #333333;
            }
          }

          .desktop-layout .cta-wrapper {
            flex-shrink: 0;
          }

          .desktop-layout .cta {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: linear-gradient(135deg, #1e3a5f 0%, #2c4f70 100%);
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(30, 58, 95, 0.3);
            position: relative;
            overflow: hidden;
            animation: gentle-glow 4s ease-in-out infinite;
          }

          @keyframes gentle-glow {
            0%,
            100% {
              box-shadow: 0 4px 12px rgba(30, 58, 95, 0.3);
            }
            50% {
              box-shadow: 0 4px 20px rgba(30, 58, 95, 0.5);
            }
          }

          .desktop-layout .cta::before {
            content: "";
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
            background-size: 200% 200%;
            animation: shimmer 3s linear infinite;
            border-radius: 25px;
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .desktop-layout .cta:hover::before {
            opacity: 1;
          }

          @keyframes shimmer {
            0% {
              background-position: 200% 50%;
            }
            100% {
              background-position: -200% 50%;
            }
          }

          .desktop-layout .cta:hover {
            background: linear-gradient(135deg, #2c4f70 0%, #3a5f85 100%);
            transform: scale(1.05) translateY(-1px);
            box-shadow: 0 8px 20px rgba(30, 58, 95, 0.4);
          }

          .desktop-layout .arrow-icon {
            transition: transform 0.3s ease;
          }

          .desktop-layout .cta:hover .arrow-icon {
            transform: translateX(3px);
            animation: arrow-bounce 1s ease-in-out infinite;
          }

          @keyframes arrow-bounce {
            0%,
            100% {
              transform: translateX(3px);
            }
            50% {
              transform: translateX(6px);
            }
          }

          @media (prefers-color-scheme: dark) {
            .desktop-layout .cta {
              background: #a0d3f3;
              color: #000000;
              box-shadow: 0 4px 12px rgba(160, 211, 243, 0.3);
            }

            .desktop-layout .cta::before {
              background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%);
            }

            .desktop-layout .cta:hover {
              background: #8bc4e6;
              box-shadow: 0 6px 16px rgba(160, 211, 243, 0.4);
            }
          }

          .arrow-icon {
            width: 14px;
            height: 14px;
          }
        }
      `}</style>
    </AdWrapper>
  );
}
