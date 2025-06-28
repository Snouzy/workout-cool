"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

import { useCurrentLocale, useI18n } from "locales/client";
import { getSessionAccess, type AccessControlContext } from "@/shared/lib/access-control";
import { Button } from "@/components/ui/button";

interface SessionAccessGuardProps {
  context: AccessControlContext;
  children: React.ReactNode;
  sessionTitle: string;
  sessionDescription?: string;
  programSlug: string;
  sessionSlug?: string;
}

/**
 * Guard component that handles session access control
 * Shows appropriate UI based on user authentication and premium status
 */
export function SessionAccessGuard({
  context,
  children,
  sessionTitle,
  sessionDescription,
  programSlug,
  sessionSlug,
}: SessionAccessGuardProps) {
  const t = useI18n();
  const router = useRouter();
  const locale = useCurrentLocale();
  const accessAction = getSessionAccess(context);

  // User can access the session - show content
  if (accessAction === "allow") {
    return <>{children}</>;
  }

  // User needs to authenticate
  if (accessAction === "require_auth") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <div className="max-w-md mx-auto text-center">
          <div className="flex items-center justify-center mx-auto mb-6">
            <Image alt="Login" height={96} src="/images/emojis/WorkoutCoolPolice.png" width={96} />
          </div>

          <h2 className="text-2xl font-bold mb-4">{t("programs.auth_required")}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{t("programs.auth_required_description")}</p>

          {sessionDescription && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-left">
              <h3 className="font-semibold mb-2">{sessionTitle}</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">{sessionDescription}</p>
            </div>
          )}

          <div className="space-y-3">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                const redirectUrl = sessionSlug
                  ? `/${locale}/programs/${programSlug}/session/${sessionSlug}`
                  : `/${locale}/programs/${programSlug}`;
                router.push(`/auth/signin?redirect=${encodeURIComponent(redirectUrl)}`);
              }}
              size="large"
            >
              {t("programs.login_to_continue")}
            </Button>
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={() => {
                const redirectUrl = sessionSlug
                  ? `/${locale}/programs/${programSlug}/session/${sessionSlug}`
                  : `/${locale}/programs/${programSlug}`;
                router.push(`/auth/signup?redirect=${encodeURIComponent(redirectUrl)}`);
              }}
              size="large"
            >
              {t("programs.signup_to_continue")}
            </Button>
            <Button className="w-full" onClick={() => router.push(`/programs/${programSlug}`)} size="large" variant="outline">
              {t("programs.back_to_program")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // User needs premium subscription
  if (accessAction === "require_premium") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <div className="max-w-md mx-auto text-center">
          <div className="flex items-center justify-center mx-auto mb-6">
            <Image alt="Premium" height={128} src="/images/emojis/WorkoutCoolRich.png" width={128} />
          </div>

          <h2 className="text-2xl font-bold mb-4">{t("programs.premium_required")}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{t("programs.premium_required_description")}</p>

          {sessionDescription && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-left">
              <h3 className="font-semibold mb-2">{sessionTitle}</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">{sessionDescription}</p>
            </div>
          )}

          <div className="space-y-3">
            <Button
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
              onClick={() => {
                // Redirect to premium page with the current session as return URL
                const returnUrl = sessionSlug
                  ? `/${locale}/programs/${programSlug}/session/${sessionSlug}`
                  : `/${locale}/programs/${programSlug}`;
                router.push(`/${locale}/premium?return=${encodeURIComponent(returnUrl)}`);
              }}
              size="large"
            >
              {t("programs.upgrade_to_premium")}
            </Button>
            <Button className="w-full" onClick={() => router.push(`/programs/${programSlug}`)} size="large" variant="outline">
              {t("programs.back_to_program")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Fallback - should not happen
  return null;
}
