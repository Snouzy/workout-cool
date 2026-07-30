import { Typography } from "./typography";

import { cn } from "@/shared/lib/utils";


export const BentoGrid = ({ className, children }: { className?: string; children?: React.ReactNode }) => {
  return <div className={cn("mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[13rem] md:grid-cols-3", className)}>{children}</div>;
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "group/bento shadow-input bg-card border-border row-span-1 flex flex-col justify-between space-y-4 rounded-xl border p-4 transition duration-200 hover:shadow-xl dark:shadow-none",
        className,
      )}
    >
      {header}
      <div className="flex flex-col gap-2">
        {icon}
        <Typography variant="large">{title}</Typography>
        <Typography variant="muted">{description}</Typography>
      </div>
    </div>
  );
};
