"use client";

import { useState } from "react";

import { useI18n } from "locales/client";
import { getServerUrl } from "@/shared/lib/server-url";
import { paths } from "@/shared/constants/paths";
import { authClient } from "@/features/auth/lib/auth-client";

export const useForgotPassword = () => {
  const t = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const forgotPassword = async (email: string, setFieldError: (message: string) => void) => {
    setIsLoading(true);
    try {
      const { error } = await authClient.forgetPassword({
        email,
        redirectTo: `${getServerUrl()}/${paths.resetPassword}`,
      });

      if (error) {
        setFieldError(t("error.sending_email"));
        return;
      }

      setIsEmailSent(true);
    } catch (error) {
      console.error(error);
      setFieldError(t("error.generic_error"));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    forgotPassword,
    isLoading,
    isEmailSent,
  };
};
