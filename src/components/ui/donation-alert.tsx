import Link from "next/link";
import { useI18n } from "locales/client";

import { cn } from "@/shared/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DonationAlertProps {
  className?: string;
}

export const DonationAlert = ({ className }: DonationAlertProps) => {
  const t = useI18n();

  return (
    <Alert
      className={cn(
        "flex items-center bg-gray-300 border-gray-400 text-gray-800 dark:bg-slate-600 dark:border-slate-500 dark:text-slate-200",
        className,
      )}
      variant="info"
    >
      <AlertDescription className="flex items-center gap-1 italic text-base">
        <span className="whitespace-pre-line">
          {t("donation_alert.title")}{" "}
          <Link
            className="font-medium text-gray-900 underline hover:text-gray-700 dark:text-gray-200"
            href="https://ko-fi.com/workoutcool"
            target="_blank"
          >
            Ko-fi
          </Link>{" "}
          or{" "}
          <Link
            className="font-medium text-gray-900 underline hover:text-gray-700 dark:text-gray-200"
            href="https://github.com/sponsors/snouzy"
            target="_blank"
          >
            GitHub Sponsors
          </Link>
          .
        </span>
      </AlertDescription>
    </Alert>
  );
};
