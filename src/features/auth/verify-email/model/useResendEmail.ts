import { useEffect, useState } from "react";

import { useI18n } from "locales/client";
import { getServerUrl } from "@/shared/lib/server-url";
import { paths } from "@/shared/constants/paths";
import { COUNTDOWN_TIME } from "@/features/auth/verify-email/constants";
import { authClient } from "@/features/auth/lib/auth-client";
import { brandedToast } from "@/components/ui/toast";

export const useResendEmail = (email: string) => {
  const t = useI18n();
  const [countdown, setCountdown] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
    setIsDisabled(false);
  }, [countdown]);

  const resend = async () => {
    try {
      setIsDisabled(true);
      setCountdown(COUNTDOWN_TIME);

      const res = await authClient.sendVerificationEmail({
        email,
        callbackURL: `${getServerUrl()}/${paths.root}`,
      });

      if (res.error) brandedToast({ title: t(res.error.message as keyof typeof t), variant: "error" });
      if (res.data?.status) brandedToast({ title: t("email_sent"), variant: "success" });
    } catch (err) {
      console.error(err);
      brandedToast({ title: t("cant_send_email"), variant: "error" });
    } finally {
      setIsDisabled(false);
    }
  };

  return { resend, isDisabled, countdown };
};
