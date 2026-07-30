import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text, Tailwind } from "@react-email/components";

interface ContactSupportEmailProps {
  email: string;
  subject: string;
  message: string;
}

const ContactSupportEmail = ({ email, subject, message }: ContactSupportEmailProps) => (
  <Html>
    <Head />
    <Preview>New Contact Request - {subject}</Preview>
    <Tailwind>
      <Body className="mx-auto my-auto bg-white font-sans">
        <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
          <Section className="mt-[32px]">
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">New Contact Request</Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              You received a new message from: <strong>{email}</strong>
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              <strong>Subject:</strong> {subject}
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[14px] leading-[24px] text-black">
              <strong>Message:</strong>
            </Text>
            <Text className="whitespace-pre-wrap text-[14px] leading-[24px] text-black">{message}</Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default ContactSupportEmail;
