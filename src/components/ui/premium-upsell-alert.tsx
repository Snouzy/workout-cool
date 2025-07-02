import React from "react";
import Link from "next/link";
import { Sparkles, Zap, Ban } from "lucide-react";

import { useI18n } from "locales/client";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AdWrapper } from "@/components/ads";

interface PremiumUpsellAlertProps {
  className?: string;
}

export const PremiumUpsellAlert = ({ className }: PremiumUpsellAlertProps) => {
  const t = useI18n();

  return (
    <AdWrapper
      fallback={
        <Alert
          className={cn(
            "flex items-center bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-400/50 dark:from-purple-600/20 dark:to-blue-600/20 dark:border-purple-500/50",
            className,
          )}
          variant="info"
        >
          <AlertDescription className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span className="text-base font-medium text-gray-900 dark:text-gray-100">{t("premium.already_premium")}</span>
            </div>
          </AlertDescription>
        </Alert>
      }
    >
      <div
        className={cn(
          "p-2 flex items-center bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-400/50 dark:from-yellow-600/20 dark:to-orange-600/20 dark:border-yellow-500/50",
          className,
        )}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
            <span className="text-base font-medium text-gray-900 dark:text-gray-100">{t("donation_alert.title")}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
              <Ban className="h-4 w-4" />
              <span>{t("premium.no_ads")}</span>
            </div>
            <Link href="/premium">
              <Button
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                size="small"
                variant="default"
              >
                {t("premium.upgrade")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </AdWrapper>
  );
};
