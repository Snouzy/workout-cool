import { Link, Section, Text } from "@react-email/components";

import { BaseEmailLayout } from "./utils/BaseEmailLayout";

import { SiteConfig } from "@/shared/config/site-config";


export default function DeleteAccountEmail({ email }: { email: string }) {
  return (
    <BaseEmailLayout previewText={"Your account has been deleted"}>
      <Section className="my-6">
        <Text className="text-lg leading-6">Hello,</Text>
        <Text className="text-lg leading-6">
          You account with email{" "}
          <Link className="text-sky-500 hover:underline" href={`mailto:${email}`}>
            {email}
          </Link>{" "}
          has been deleted.
        </Text>
        <Text className="text-lg leading-6">This action is irreversible.</Text>
        <Text className="text-lg leading-6">If you have any questions, please contact us at {SiteConfig.email.contact}.</Text>
      </Section>
      <Text className="text-lg leading-6">
        Best,
        <br />- {SiteConfig.maker.name} from {SiteConfig.title}
      </Text>
    </BaseEmailLayout>
  );
}
