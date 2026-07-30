import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/utils";


export type DividerProps = ComponentProps<"div">;

export const Divider = ({ className, children, ...props }: DividerProps) => {
  return (
    <span className={cn("relative flex justify-center", className)} {...props}>
      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75"></div>

      <span className="bg-muted z-10 mx-1 rounded-full border px-2 py-1 text-center text-xs">{children}</span>
    </span>
  );
};
