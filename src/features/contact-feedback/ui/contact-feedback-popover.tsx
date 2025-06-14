"use client";

import { useBoolean } from "usehooks-ts";

import { useI18n } from "locales/client";
import { ReviewInput } from "@/features/contact-feedback/ui/ReviewInput";
import { ContactFeedbackSchema, ContactFeedbackSchemaType } from "@/features/contact-feedback/model/contact-feedback.schema";
import { contactFeedbackAction } from "@/features/contact-feedback/model/contact-feedback.action";
import { useCurrentSession } from "@/entities/user/model/useCurrentSession";
import { brandedToast } from "@/components/ui/toast";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, useZodForm } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import type { PropsWithChildren } from "react";

export type ContactFeedbackPopoverProps = PropsWithChildren<{}>;

export const ContactFeedbackPopover = (props: ContactFeedbackPopoverProps) => {
  const t = useI18n();
  const open = useBoolean();
  const session = useCurrentSession();
  const email = session?.user?.email ?? "";
  const form = useZodForm({
    schema: ContactFeedbackSchema,
    defaultValues: {
      email: email,
    },
  });

  const onSubmit = async (values: ContactFeedbackSchemaType) => {
    const result = await contactFeedbackAction(values);

    if (!result) {
      brandedToast({ title: t("error.generic_error"), variant: "error" });
      return;
    }

    if (result.serverError) {
      brandedToast({ title: t(`backend_errors.${result.serverError}` as keyof typeof t), variant: "error" });
      return;
    }

    brandedToast({ title: t("success.feedback_sent"), variant: "success" });
    form.reset();
    open.setFalse();
  };

  return (
    <Popover onOpenChange={open.toggle} open={open.value}>
      <PopoverTrigger asChild>{props.children ? props.children : <Button variant="outline">Feedback</Button>}</PopoverTrigger>
      <PopoverContent className="p-0">
        <Form className="flex flex-col gap-4" form={form} onSubmit={async (v) => onSubmit(v)}>
          <div className="p-2">
            {email ? null : (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="border-secondary bg-secondary/50 flex w-full items-center justify-between border-t p-2">
            <FormField
              control={form.control}
              name="review"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <ReviewInput
                    onChange={(v) => {
                      field.onChange(v);
                    }}
                    value={field.value}
                  />
                </FormItem>
              )}
            />
            <Button type="submit" variant="outline">
              {t("commons.submit")}
            </Button>
          </div>
        </Form>
      </PopoverContent>
    </Popover>
  );
};
