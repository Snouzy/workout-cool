"use client";

import { useState } from "react";
import Link from "next/link";

import { useI18n } from "locales/client";
import { SiteConfig } from "@/shared/config/site-config";
import { useCurrentSession } from "@/entities/user/model/useCurrentSession";
import { brandedToast } from "@/components/ui/toast";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, useZodForm } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { ContactSupportSchema } from "./contact-support.schema";
import { contactSupportAction } from "./contact-support.action";

import type { PropsWithChildren } from "react";
import type { ContactSupportSchemaType } from "./contact-support.schema";

export type ContactSupportDialogProps = PropsWithChildren<{
  email?: string;
  className?: string;
}>;

export const ContactSupportDialog = (props: ContactSupportDialogProps) => {
  const [open, setOpen] = useState(false);
  const session = useCurrentSession();
  const t = useI18n();
  const email = session?.user?.email ?? "";
  const form = useZodForm({
    schema: ContactSupportSchema,
    defaultValues: {
      email: email,
    },
  });

  const onSubmit = async (values: ContactSupportSchemaType) => {
    const action = await contactSupportAction(values);

    if (!action || !action.data) {
      brandedToast({ title: action?.serverError ?? t("error.generic_error"), variant: "error" });
      return;
    }

    brandedToast({ title: t("email_sent"), variant: "success" });
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog onOpenChange={(v) => setOpen(v)} open={open}>
      <DialogTrigger asChild className="cursor-pointer">
        {props.children ? props.children : <span className={props.className}>{t("support")}</span>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("contact_support")}</DialogTitle>
          <DialogDescription>
            {t("contact_support_subtitle")}{" "}
            <Link className="text-primary" href={`mailto:${SiteConfig.email.contact}`}>
              {SiteConfig.email.contact}
            </Link>
            .
          </DialogDescription>
        </DialogHeader>
        <Form className="flex flex-col gap-4" form={form} onSubmit={async (v) => onSubmit(v)}>
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
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("commons.subject")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("commons.message")}</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">{t("commons.submit")}</Button>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
