import { cva } from "class-variance-authority";


import type { ComponentPropsWithoutRef, ElementType, PropsWithChildren } from "react";
import type { VariantProps } from "class-variance-authority";

import { cn } from "@/shared/lib/utils";

type PolymorphicAsProp<E extends ElementType> = {
  as?: E | React.ComponentType<Omit<ComponentPropsWithoutRef<E>, "as">> | React.FunctionComponent<Omit<ComponentPropsWithoutRef<E>, "as">>;
};

type PolymorphicProps<E extends ElementType> = PropsWithChildren<Omit<ComponentPropsWithoutRef<E>, "as"> & PolymorphicAsProp<E>>;

const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "scroll-m-20 font-caption text-4xl font-extrabold tracking-tight lg:text-5xl",
      h2: "scroll-m-20 font-caption text-3xl font-semibold tracking-tight transition-colors first:mt-0",
      h3: "scroll-m-20 font-caption text-xl font-semibold tracking-tight",
      p: "leading-7 [&:not(:first-child)]:mt-6",
      base: "",
      quote: "citation",
      code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
      lead: "text-xl text-muted-foreground",
      large: "text-lg font-semibold",
      small: "text-sm font-medium leading-none",
      muted: "text-sm text-muted-foreground",
      link: "font-medium text-primary underline underline-offset-3 hover:underline hover:scale-[0.95] transition-all duration-300",
    },
  },
  defaultVariants: {
    variant: "base",
  },
});
type TypographyCvaProps = VariantProps<typeof typographyVariants>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const defaultElement = "p";

const defaultElementMapping: Record<NonNullable<TypographyCvaProps["variant"]>, ElementType> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  p: "p",
  quote: "blockquote" as "p",
  code: "code",
  lead: "p",
  large: "p",
  small: "p",
  muted: "p",
  link: "a",
  base: "p",
} as const;

export function Typography<E extends ElementType = typeof defaultElement>({
  as,
  children,
  className,
  variant,
  ...restProps
}: PolymorphicProps<E> & TypographyCvaProps) {
  const Component: ElementType = as ?? defaultElementMapping[variant ?? "base"];

  return (
    <Component {...(restProps as ComponentPropsWithoutRef<E>)} className={cn(typographyVariants({ variant }), className)}>
      {children}
    </Component>
  );
}
