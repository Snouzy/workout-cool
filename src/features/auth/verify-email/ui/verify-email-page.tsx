"use client";

import { Mail } from "lucide-react";
import { useI18n } from "locales/client";

import { cn } from "@/shared/lib/utils";
import { paths } from "@/shared/constants/paths";
import { useResendEmail } from "@/features/auth/verify-email/model/useResendEmail";
import { useLogout } from "@/features/auth/model/useLogout";
import { useCurrentUser } from "@/entities/user/model/useCurrentUser";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const VerifyEmailPage = () => {
  const t = useI18n();
  const user = useCurrentUser();
  const logout = useLogout(`/${paths.signIn}`);

  const { resend, isDisabled, countdown } = useResendEmail(user?.email ?? "");

  const handleResendEmail = async () => {
    resend();
  };

  return (
    <div className="bg-background place-items-center px-4 h-full flex items-center justify-center">
      <Card className="w-full max-w-md p-4 border-none shadow-none">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-primary/10 p-3">
              <Mail className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-semibold">{t("verify_email")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <CardDescription className="text-center text-base">{t("verify_email_subtitle")}</CardDescription>

          <div className="flex flex-col gap-3">
            <Button
              className={cn("text-primary hover:text-primary/80")}
              disabled={isDisabled}
              onClick={handleResendEmail}
              variant="outline"
            >
              {isDisabled ? t("resend_email_countdown", { seconds: countdown }) : t("resend_email")}
            </Button>

            <Button className="text-muted-foreground hover:text-foreground" onClick={() => logout.mutate()} variant={null}>
              {t("logout")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
