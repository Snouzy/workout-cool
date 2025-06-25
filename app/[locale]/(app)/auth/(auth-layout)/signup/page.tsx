import Link from "next/link";

import { getI18n } from "locales/server";
import { paths } from "@/shared/constants/paths";
import { SignUpForm } from "@/features/auth/signup/ui/signup-form";

export const metadata = {
  title: "Sign Up - Workout.cool",
  description: "Créez votre compte pour commencer",
};

export default async function AuthSignUpPage() {
  const t = await getI18n();

  return (
    <div className="container mx-auto max-w-lg px-4 py-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{t("register_title")}</h1>
        <p className="text-muted-foreground">{t("register_description")}</p>
      </div>

      <SignUpForm />

      <div className="text-muted-foreground mt-6 text-center text-sm">
        <p>
          {t("register_terms")}{" "}
          <Link className="font-medium text-primary underline-offset-4 hover:underline" href={paths.privacy}>
            {t("register_privacy")}
          </Link>{" "}
          .
        </p>
      </div>
    </div>
  );
}
