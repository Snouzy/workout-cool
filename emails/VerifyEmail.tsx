import { Button, Heading, Hr, Link, Section, Text } from "@react-email/components";

import { BaseEmailLayout } from "./utils/BaseEmailLayout"; // Import the layout

import { SiteConfig } from "@/shared/config/site-config";


interface VerifyEmailProps {
  url: string;
}

const primaryColor = "#2563EB"; // Blue-600

export const VerifyEmail = ({ url }: VerifyEmailProps) => (
  <BaseEmailLayout previewText={`Verify your email address for ${SiteConfig.title}`}>
    <Heading className="mb-6 text-center text-2xl font-semibold text-gray-900">✅ Verify Your Email</Heading>

    <Section>
      <Text className="text-text text-base leading-relaxed">Welcome to {SiteConfig.title}!</Text>
      <Text className="text-text text-base leading-relaxed">
        Please click the button below to verify your email address and complete your signup or login:
      </Text>
    </Section>

    <Section className="my-8 text-center">
      <Button
        className="inline-block rounded-md bg-primary px-6 py-3 text-center text-sm font-medium text-white no-underline transition hover:opacity-90"
        href={url}
        style={{ backgroundColor: primaryColor }} // Inline style for better email client compatibility
      >
        Verify Email Address
      </Button>
    </Section>

    <Section>
      <Text className="text-text text-base leading-relaxed">If you didn&apos;t request this email, you can safely ignore it.</Text>
    </Section>

    <Hr className="my-6 border-t" />

    <Section>
      <Text className="text-lightText text-sm leading-normal">
        If the button above doesn&apos;t work, you can copy and paste this link into your browser:
      </Text>
      <Link className="block break-all text-sm text-primary hover:underline" href={url}>
        {url}
      </Link>
    </Section>
    {/* Footer is now handled by BaseEmailLayout */}
  </BaseEmailLayout>
);
