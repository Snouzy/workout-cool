import React from "react";
import Link from "next/link";
import { Sparkles, Zap, Ban } from "lucide-react";

import { useI18n } from "locales/client";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PremiumUpsellAlertProps {
  className?: string;
}

export const PremiumUpsellAlert = ({ className }: PremiumUpsellAlertProps) => {
  const t = useI18n();

  return (
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
  );
};
