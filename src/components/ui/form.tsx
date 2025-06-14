import { Controller, FormProvider, useForm, useFormContext } from "react-hook-form";
import * as React from "react";
import { TriangleAlert } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import { zodResolver } from "@hookform/resolvers/zod";

import { useI18n } from "locales/client";
import { cn } from "@/shared/lib/utils";

import { Label } from "./label";

import type { z, ZodSchema } from "zod";
import type { ControllerProps, FieldPath, FieldValues, SubmitHandler, UseFormProps, UseFormReturn } from "react-hook-form";
import type * as LabelPrimitive from "@radix-ui/react-label";

type FormProps<T extends FieldValues> = Omit<React.ComponentProps<"form">, "onSubmit"> & {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  disabled?: boolean;
};

const Form = <T extends FieldValues>({ form, onSubmit, children, className, disabled, ...props }: FormProps<T>) => (
  <FormProvider {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} {...props} className={className}>
      <fieldset className={className} disabled={disabled || form.formState.isSubmitting}>
        {children}
      </fieldset>
    </form>
  </FormProvider>
);

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

const FormField = <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext.name) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div className={cn("space-y-2", className)} ref={ref} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return <Label className={cn(error && "text-destructive", className)} htmlFor={formItemId} ref={ref} {...props} />;
});
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<React.ElementRef<typeof Slot>, React.ComponentPropsWithoutRef<typeof Slot>>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  return (
    <Slot
      aria-describedby={error ? `${formDescriptionId} ${formMessageId}` : `${formDescriptionId}`}
      aria-invalid={!!error}
      id={formItemId}
      ref={ref}
      {...props}
    />
  );
});
FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    const { formDescriptionId } = useFormField();

    return <p className={cn("text-muted-foreground text-sm", className)} id={formDescriptionId} ref={ref} {...props} />;
  },
);
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ children, ...props }, ref) => {
  const t = useI18n();
  const { error, formMessageId } = useFormField();
  const body = error ? String(error.message) : children;

  if (!body) {
    return null;
  }

  return (
    <div className="!mt-2.5 flex items-center gap-2" id={formMessageId} ref={ref} {...props}>
      <TriangleAlert className="size-[18px] shrink-0 text-danger dark:text-danger/70" />
      <p className="text-xs/tight font-medium text-danger">{t(body as keyof typeof t)}</p>
    </div>
  );
});
FormMessage.displayName = "FormMessage";

type UseZodFormProps<Schema extends ZodSchema> = Exclude<UseFormProps<z.infer<Schema>>, "resolver"> & {
  schema: Schema;
};

function useZodForm<Schema extends ZodSchema>({ schema, ...formProps }: UseZodFormProps<Schema>): UseFormReturn<z.infer<Schema>> {
  return useForm<z.infer<Schema>>({
    ...formProps,
    resolver: zodResolver(schema as any),
  });
}

export { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, useFormField, useZodForm };
