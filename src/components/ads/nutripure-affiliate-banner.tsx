"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

import { AdWrapper } from "./AdWrapper";

const messageVariants = [
  {
    title: "Nutrition sportive premium",
    description: "Compléments naturels pour maximiser vos performances",
    cta: "Découvrir",
    badge: "🇫🇷 Made in France",
  },
  {
    title: "Whey protéine de qualité",
    description: "Sans additifs, 100% traçable pour votre récupération",
    cta: "En savoir plus",
    badge: "⭐ 4.8/5",
  },
  {
    title: "Pack découverte Nutripure",
    description: "Multi-vitamines, Omega 3 et Magnésium haute qualité",
    cta: "Commander",
    badge: "⚡ Nouveau",
  },
];

export function NutripureAffiliateBanner() {
  const affiliateUrl = "https://c3po.link/QVupuZ8DYw";
  const [currentVariant, setCurrentVariant] = useState(0);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * messageVariants.length);
    setCurrentVariant(randomIndex);
  }, []);

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
                    <Image alt="Nutripure" className="object-cover rounded-l" fill sizes="50px" src="/images/nutripure-gellules.png" />
                  </div>
                  <div className="content-section">
                    <span className="badge">{message.badge}</span>
                    <h4 className="title">{message.title}</h4>
                    <span className="cta">{message.cta} →</span>
                  </div>
                </div>

                {/* Tablet/Desktop Layout */}
                <div className="desktop-layout">
                  <div className="image-section">
                    <Image alt="Nutripure" className="object-cover rounded-l-lg" fill sizes="90px" src="/images/nutripure-gellules.png" />
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
          max-width: 320px;
          height: 50px;
        }

        .nutripure-banner {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          border: 1px solid #86efac;
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.3s ease;
          position: relative;
        }

        .nutripure-banner:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.15);
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
          height: 50px;
          flex-shrink: 0;
        }

        .mobile-layout .content-section {
          flex: 1;
          padding: 0 8px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .mobile-layout .badge {
          display: none;
        }

        .mobile-layout .title {
          font-size: 12px;
          font-weight: 600;
          color: #15803d;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
        }

        .mobile-layout .cta {
          font-size: 11px;
          font-weight: 600;
          color: #16a34a;
          white-space: nowrap;
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
          }

          .mobile-layout .title {
            font-size: 13px;
          }

          .mobile-layout .badge {
            display: inline-block;
            font-size: 10px;
            background: #16a34a;
            color: white;
            padding: 2px 6px;
            border-radius: 4px;
          }

          .mobile-layout .cta {
            font-size: 12px;
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
            font-size: 11px;
            background: linear-gradient(135deg, #16a34a, #15803d);
            color: white;
            padding: 4px 8px;
            border-radius: 6px;
            font-weight: 600;
            white-space: nowrap;
          }

          .desktop-layout .text-content {
            flex: 1;
          }

          .desktop-layout .title {
            font-size: 16px;
            font-weight: 700;
            color: #15803d;
            margin-bottom: 2px;
          }

          .desktop-layout .description {
            font-size: 13px;
            color: #166534;
            line-height: 1.3;
          }

          .desktop-layout .cta-wrapper {
            flex-shrink: 0;
          }

          .desktop-layout .cta {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            background: #16a34a;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
            transition: background 0.3s ease;
          }

          .desktop-layout .cta:hover {
            background: #15803d;
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
