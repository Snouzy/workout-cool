import { cn } from "@/shared/lib/utils";
import { Typography } from "@/components/ui/typography";

import type { ComponentPropsWithoutRef } from "react";

export const Layout = (props: ComponentPropsWithoutRef<"div">) => {
  return <div {...props} className={cn("", props.className)} />;
};

export const LayoutHeader = (props: ComponentPropsWithoutRef<"div">) => {
  return <div {...props} className={cn("flex w-full min-w-[200px] flex-col items-start gap-2 md:flex-1", props.className)} />;
};

export const LayoutTitle = (props: ComponentPropsWithoutRef<"h1">) => {
  return <Typography {...props} className={cn(props.className)} variant="h2" />;
};

export const LayoutDescription = (props: ComponentPropsWithoutRef<"p">) => {
  return <Typography {...props} className={cn(props.className)} />;
};

export const LayoutActions = (props: ComponentPropsWithoutRef<"div">) => {
  return <div {...props} className={cn("flex items-center", props.className)} />;
};

export const LayoutContent = (props: ComponentPropsWithoutRef<"div">) => {
  return <div {...props} className={cn("w-full", props.className)} />;
};
