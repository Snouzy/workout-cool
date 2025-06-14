"use client";

import { toast } from "sonner";
import * as React from "react";
import Image from "next/image";
import { X, CheckCircle2, AlertTriangle, Info, XCircle } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import * as ToastPrimitives from "@radix-ui/react-toast";

import Logo from "@public/logo.png";
import { cn } from "@/shared/lib/utils";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 transition-all duration-300 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[492px]",
      className,
    )}
    ref={ref}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-lg p-4 duration-300 transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full shadow-3xl",

  {
    variants: {
      variant: {
        default: "bg-white text-black dark:bg-black-dark dark:text-white",
        black: "bg-black text-white",
        destructive: "destructive group border-danger-light border bg-white text-danger",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return <ToastPrimitives.Root className={cn(toastVariants({ variant }), className)} ref={ref} {...props} />;
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => <ToastPrimitives.Action className={cn("inline-block", className)} ref={ref} {...props} />);
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    className={cn(
      "text-foreground/50 hover:text-foreground absolute top-3.5 rounded-md p-1 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600 ltr:right-3.5 rtl:left-3.5",
      className,
    )}
    ref={ref}
    toast-close=""
    {...props}
  >
    <X className="size-[18px]" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => <ToastPrimitives.Title className={cn("text-sm font-semibold", className)} ref={ref} {...props} />);
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastIcon = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => <ToastPrimitives.Title className={cn("size-5", className)} ref={ref} {...props} />);
ToastIcon.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    className={cn("text-xs/[18px] font-semibold text-gray dark:text-gray-600", className)}
    ref={ref}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

type BrandedToastVariant = "default" | "success" | "error" | "info" | "warning";

const variantStyles: Record<BrandedToastVariant, { icon: React.ReactNode; color: string }> = {
  default: {
    icon: <Info className="h-4 w-4 text-primary" />,
    color: "bg-primary/5 border-primary",
  },
  success: {
    icon: <CheckCircle2 className="h-4 w-4 text-green-600" />,
    color: "bg-green-50 border-green-600",
  },
  error: {
    icon: <XCircle className="h-4 w-4 text-danger" />,
    color: "bg-danger/10 border-danger",
  },
  info: {
    icon: <Info className="h-4 w-4 text-blue-600" />,
    color: "bg-blue-50 border-blue-600",
  },
  warning: {
    icon: <AlertTriangle className="h-4 w-4 text-yellow-600" />,
    color: "bg-yellow-50 border-yellow-600",
  },
};

interface BrandedToastOptions {
  title: string;
  subtitle?: string;
  variant?: BrandedToastVariant;
}

const BrandedToastContent = ({ title, subtitle, variant = "default" }: BrandedToastOptions) => {
  const { icon, color } = variantStyles[variant];

  return (
    <ToastDescription className={"dark:bg-black-dark dark:text-white"}>
      <div className={`-mt-0.5 flex items-center gap-2 border-b px-4 py-3 ${color}`}>
        <Image alt="logo" height={24} src={Logo} width={24} />
      </div>
      <div className="flex items-center p-4">
        {icon}
        <p className="text-1sm pl-2 font-sans text-black dark:text-white">{title}</p>
      </div>
      {subtitle && <p className="!text-xs/20 p-4 pt-0 font-sans text-black/50 dark:text-white">{subtitle}</p>}
    </ToastDescription>
  );
};

function brandedToast(options: BrandedToastOptions) {
  toast(<BrandedToastContent {...options} />);
}

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastIcon,
  ToastAction,
  brandedToast,
};
