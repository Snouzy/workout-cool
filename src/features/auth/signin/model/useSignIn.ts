import { useI18n } from "locales/client";
import { paths } from "@/shared/constants/paths";
import { LoginSchema } from "@/features/auth/signin/schema/signin.schema";
import { authClient } from "@/features/auth/lib/auth-client";
import { brandedToast } from "@/components/ui/toast";

export const useSignIn = () => {
  const t = useI18n();

  const signIn = async (values: LoginSchema) => {
    const response = await authClient.signIn.email({
      email: values.email,
      password: values.password,
      callbackURL: `${paths.root}?signin=true`,
    });

    if (response?.error) {
      brandedToast({ title: t("error.invalid_credentials"), variant: "error" });
      return;
    }
  };

  return {
    signIn,
  };
};
