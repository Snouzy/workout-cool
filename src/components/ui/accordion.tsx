"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";

import { cn } from "@/shared/lib/utils";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => <AccordionPrimitive.Item className={cn("border-b border-black", className)} ref={ref} {...props} />);
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      className={cn(
        "font-mono group flex flex-1 items-center justify-between py-4 text-left transition-colors hover:underline",
        "data-[state=open]:bg-accent/40",
        className,
      )}
      ref={ref}
      {...props}
    >
      <span>{children}</span>
      <ChevronDown
        className={cn(
          "ml-2 size-5 shrink-0 transition-transform duration-200 ease-linear",
          "group-data-[state=closed]:rotate-0 group-data-[state=open]:rotate-180",
          "text-current",
        )}
      />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    className={cn(
      "overflow-hidden transition-[max-height,padding] duration-200 ease-in-out data-[state=closed]:pt-0 data-[state=open]:pt-2",
      "data-[state=closed]:max-h-0",
      className,
    )}
    ref={ref}
    {...props}
  >
    <div className="text-muted-foreground font-mono text-sm">{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
