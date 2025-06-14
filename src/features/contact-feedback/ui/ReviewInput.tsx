import { Angry, Frown, Meh, SmilePlus } from "lucide-react";

import { useI18n } from "locales/client";
import { cn } from "@/shared/lib/utils";
import { InlineTooltip } from "@/components/ui/tooltip";

export const ReviewInput = ({ onChange, value }: { onChange: (value: string) => void; value?: string }) => {
  const t = useI18n();

  const options = [
    { value: "1", icon: Angry, tooltip: t("commons.extremely_dissatisfied") },
    { value: "2", icon: Frown, tooltip: t("commons.somewhat_dissatisfied") },
    { value: "3", icon: Meh, tooltip: t("commons.neutral") },
    { value: "4", icon: SmilePlus, tooltip: t("commons.satisfied") },
  ];

  return (
    <>
      {options.map((item) => (
        <InlineTooltip key={item.value} title={item.tooltip}>
          <button
            className={cn("transition hover:rotate-12 hover:scale-110", {
              "-rotate-[16deg] scale-[1.2] text-primary": value === item.value,
            })}
            onClick={() => onChange(item.value)}
            type="button"
          >
            <item.icon size={24} />
          </button>
        </InlineTooltip>
      ))}
    </>
  );
};
