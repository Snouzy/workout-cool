"use client";
import Link from "next/link";
import { useI18n } from "locales/client";

import { Button } from "@/components/ui/button";

export const SignInButton = () => {
  const t = useI18n();

  return (
    <Button asChild size="large" variant="link">
      <Link href={"/auth/signin?callbackUrl=/"}>{t("commons.login")}</Link>
    </Button>
  );
};
