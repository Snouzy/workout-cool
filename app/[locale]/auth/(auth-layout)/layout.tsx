import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";

import { getI18n } from "locales/server";
import Logo from "@public/logo.png";
import { paths } from "@/shared/constants/paths";
import { auth } from "@/features/auth/lib/better-auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import type { LayoutParams } from "@/shared/types/next";

export default async function AuthLayout(props: LayoutParams<{}>) {
  const t = await getI18n();

  const headerStore = await headers();
  const searchParams = Object.fromEntries(new URLSearchParams(headerStore.get("searchParams") || ""));
  const translatedError = t(`next_auth_errors.${searchParams.error}` as keyof typeof t);

  const user = await auth.api.getSession({ headers: headerStore });

  if (user) {
    redirect(`/${paths.root}`);
  }

  return (
    <>
      <div>
        <div className="flex justify-center gap-2">
          <Link className="flex items-center gap-2 font-medium" href={`/${paths.root}`}>
            <Image alt="workout cool logo" className="w-16" height={64} src={Logo} width={64} />
          </Link>
        </div>

        {searchParams.error && (
          <Alert className="mb-4" variant="error">
            <AlertTitle>{translatedError}</AlertTitle>
            <AlertDescription>{t("signin_error_subtitle")}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">{props.children}</div>
        </div>
      </div>
    </>
  );
}
