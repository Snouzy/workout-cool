import * as React from "react";
import { Body, Container, Head, Hr, Html, Img, Preview, Section, Text, Tailwind } from "@react-email/components";

import { SiteConfig } from "@/shared/config/site-config";

interface BaseEmailLayoutProps {
  previewText: string;
  children: React.ReactNode;
}

// Consistent styling variables
const primaryColor = "#2563EB"; // Blue-600
// eslint-disable-next-line quotes
const fontFamily = 'Inter, "Helvetica Neue", Helvetica, Arial, sans-serif';
const containerPadding = "32px"; // p-8
const mainBgColor = "#f9fafb"; // bg-gray-50
const containerBgColor = "#ffffff"; // bg-white
const textColor = "#374151"; // text-gray-700
const lightTextColor = "#6b7280"; // text-gray-500
const borderColor = "#e5e7eb"; // border-gray-200

export const BaseEmailLayout = ({ previewText, children }: BaseEmailLayoutProps) => (
  <Html>
    <Head>
      {/* Font import */}
      <link href="https://fonts.googleapis.com" rel="preconnect" />
      <link crossOrigin="" href="https://fonts.gstatic.com" rel="preconnect" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet" />
    </Head>
    <Preview>{previewText}</Preview>
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              primary: primaryColor,
              text: textColor,
              lightText: lightTextColor,
            },
            fontFamily: {
              sans: [fontFamily],
            },
            borderColor: {
              DEFAULT: borderColor,
            },
          },
        },
      }}
    >
      <Body className="mx-auto my-auto bg-gray-50 font-sans" style={{ backgroundColor: mainBgColor }}>
        <Container
          className="mx-auto my-10 max-w-md rounded-lg border border-solid bg-white shadow-sm"
          style={{
            padding: containerPadding,
            backgroundColor: containerBgColor,
            borderColor: borderColor,
          }}
        >
          {/* Logo Section */}
          <Section className="mb-6 text-center">
            <Img alt={`${SiteConfig.title} Logo`} className="mx-auto" height="36" src={SiteConfig.logo} width="auto" />
          </Section>

          {/* Email specific content */}
          {children}

          {/* Footer Section */}
          <Hr className="my-6 border-t" style={{ borderColor: borderColor }} />
          <Section>
            <Text className="text-lightText text-sm" style={{ color: lightTextColor }}>
              Best regards,
              <br />
              The {SiteConfig.title} Team
            </Text>
            {/* Optional: Add company address or other info here if needed */}
            {/* <Text className="text-xs text-gray-400">{SiteConfig.company.address}</Text> */}
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);
