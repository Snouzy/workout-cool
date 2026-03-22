import * as React from "react";
import { Body, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text, Tailwind } from "@react-email/components";

interface SponsorOnboardingEmailProps {
  brandName: string;
  email: string;
  websiteUrl: string;
  logoUrl: string;
  tagline?: string;
  notes?: string;
}

const SponsorOnboardingEmail = ({ brandName, email, websiteUrl, logoUrl, tagline, notes }: SponsorOnboardingEmailProps) => (
  <Html>
    <Head />
    <Preview>New Sponsor: {brandName}</Preview>
    <Tailwind>
      <Body className="mx-auto my-auto bg-white font-sans">
        <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
          <Section className="mt-[32px]">
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              New Sponsor Onboarding
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              <strong>{brandName}</strong> just completed the sponsor onboarding form after payment.
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[14px] leading-[24px] text-black">
              <strong>Brand:</strong> {brandName}
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              <strong>Email:</strong> {email}
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              <strong>Website:</strong> <Link href={websiteUrl}>{websiteUrl}</Link>
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              <strong>Logo:</strong> <Link href={logoUrl}>{logoUrl}</Link>
            </Text>
            {tagline && (
              <Text className="text-[14px] leading-[24px] text-black">
                <strong>Tagline:</strong> {tagline}
              </Text>
            )}
            {notes && (
              <>
                <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
                <Text className="text-[14px] leading-[24px] text-black">
                  <strong>Additional notes:</strong>
                </Text>
                <Text className="whitespace-pre-wrap text-[14px] leading-[24px] text-black">{notes}</Text>
              </>
            )}
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default SponsorOnboardingEmail;
