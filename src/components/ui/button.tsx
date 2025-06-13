import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/shared/lib/utils";

const buttonVariants = cva(
  "hover:scale-[0.98] inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-2 text-center text-xs/4 font-medium outline-none transition duration-300 disabled:pointer-events-none disabled:opacity-30 disabled:hover:cursor-not-allowed [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/90", // Simplified hover
        destructive: "bg-red-600 text-white hover:bg-red-600/90", // Destructive variant
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700", // Secondary variant
        ghost: "hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100", // Ghost variant
        link: "text-primary underline-offset-4 hover:underline", // Link variant
        black: "bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90", // Adjusted hover for black
        outline: "border border-primary bg-transparent text-primary shadow-sm hover:bg-primary/5", // Adjusted outline
        "outline-black":
          "border border-black bg-transparent text-black shadow-sm hover:bg-black/5 dark:border-white dark:text-white dark:hover:bg-white/5", // Adjusted outline-black
        "outline-general":
          "border border-gray-300 bg-transparent text-black shadow-sm hover:bg-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800", // Adjusted outline-general
      },
      size: {
        extraSmall: "rounded-md p-1 text-xs",
        small: "rounded-md px-2 text-xs",
        default: "text-md p-1 px-3",
        large: "text-md px-3 py-2",
        extralarge: "text-md rounded-[10px] px-3.5 py-[11px] font-semibold [&>svg]:size-[18px]",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = "Button";

export { Button, buttonVariants };
