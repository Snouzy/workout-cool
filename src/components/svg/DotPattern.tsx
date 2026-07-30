import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/shared/lib/utils";


export type DotPatternProps = ComponentPropsWithoutRef<"div">;

export const DotPattern = ({ children, className, ...props }: DotPatternProps) => {
  return (
    <div className={cn("relative w-full", className)} {...props}>
      <div
        className="dot-pattern absolute inset-0 -translate-x-4 translate-y-3"
        style={{
          // @ts-expect-error CSS Variable
          "--dot-background": "transparent",
          "--dot-color": "hsl(var(--primary))",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
};
