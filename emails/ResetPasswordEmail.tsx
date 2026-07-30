import { Button, Heading, Hr, Link, Section, Text } from "@react-email/components";

import { BaseEmailLayout } from "./utils/BaseEmailLayout"; // Import the layout

import { SiteConfig } from "@/shared/config/site-config";


interface ResetPasswordEmailProps {
  url: string;
}

const primaryColor = "#2563EB"; // Blue-600

export const ResetPasswordEmail = ({ url }: ResetPasswordEmailProps) => (
  <BaseEmailLayout previewText={`Reset your password for ${SiteConfig.title}`}>
    <Heading className="mb-6 text-center text-2xl font-semibold text-gray-900">🔒 Reset Your Password</Heading>

    <Section>
      <Text className="text-text text-base leading-relaxed">Hello,</Text>
      <Text className="text-text text-base leading-relaxed">
        We received a request to reset the password for your {SiteConfig.title} account. If this was you, click the button below to set a
        new password:
      </Text>
    </Section>

    <Section className="my-8 text-center">
      <Button
        className="inline-block rounded-md bg-primary px-6 py-3 text-center text-sm font-medium text-white no-underline transition hover:opacity-90"
        href={url}
        style={{ backgroundColor: primaryColor }} // Inline style for better email client compatibility
      >
        Set New Password
      </Button>
    </Section>

    <Section>
      <Text className="text-text text-base leading-relaxed">
        If you didn&apos;t request a password reset, please ignore this email. Your password will remain unchanged.
      </Text>
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

export default ResetPasswordEmail; // Keep export consistent
