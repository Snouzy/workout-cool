import React from "react";
import Link from "next/link";

import { useI18n } from "locales/client";
import { cn } from "@/shared/lib/utils";
import { paths } from "@/shared/constants/paths";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LocalAlertProps {
  className?: string;
}

export const LocalAlert = ({ className }: LocalAlertProps) => {
  const t = useI18n();

  return (
    <Alert className={cn("bg-blue-100 border-0 text-black", className)} variant="info">
      <AlertDescription className="flex flex-wrap items-center gap-1 italic text-base">
        {t("profile.alert.title")}
        <br className="sm:hidden" />
        <Link className="ml-1 mr-1 font-medium text-blue-700 underline" href={paths.signUp} data-testid="profile-page-signup">
          {t("profile.alert.create_account")}
        </Link>
        {t("commons.or").toLocaleLowerCase()}
        <Link className="ml-1 font-medium text-purple-700 underline" href={paths.signIn} data-testid="profile-page-login">
          {t("profile.alert.log_in")}
        </Link>
        {t("profile.alert.to_ensure_it_is_not_getting_lost")}
      </AlertDescription>
    </Alert>
  );
};
