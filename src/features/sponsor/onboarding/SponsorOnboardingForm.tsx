"use client";

import { useAction } from "next-safe-action/hooks";
import { CheckCircle, ExternalLink, Loader2 } from "lucide-react";

import { useI18n } from "locales/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, useZodForm } from "@/components/ui/form";

import { SponsorOnboardingSchema, type SponsorOnboardingSchemaType } from "./sponsor-onboarding.schema";
import { sponsorOnboardingAction } from "./sponsor-onboarding.action";

export function SponsorOnboardingForm() {
  const t = useI18n();
  const form = useZodForm({
    schema: SponsorOnboardingSchema,
    defaultValues: {
      brandName: "",
      email: "",
      websiteUrl: "",
      logoUrl: "",
      tagline: "",
      notes: "",
    },
  });

  const { execute, status } = useAction(sponsorOnboardingAction);

  const onSubmit = (data: SponsorOnboardingSchemaType) => {
    execute(data);
  };

  if (status === "hasSucceeded") {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <CheckCircle className="w-16 h-16 text-emerald-500" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t("ads.onboarding_success_title")}</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md">{t("ads.onboarding_success_description")}</p>
      </div>
    );
  }

  return (
    <Form className="space-y-5" form={form} onSubmit={onSubmit}>
      <FormField
        control={form.control}
        name="brandName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("ads.onboarding_brand_name")}</FormLabel>
            <FormControl>
              <Input placeholder="Acme Inc." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("ads.onboarding_email")}</FormLabel>
            <FormControl>
              <Input placeholder="sponsor@example.com" type="email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="websiteUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("ads.onboarding_website")}</FormLabel>
            <FormControl>
              <Input placeholder="https://example.com" type="url" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="logoUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("ads.onboarding_logo")}</FormLabel>
            <FormControl>
              <Input placeholder="https://example.com/logo.png" type="url" {...field} />
            </FormControl>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t("ads.onboarding_logo_hint")}</p>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="tagline"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t("ads.onboarding_tagline")} <span className="text-slate-400 font-normal">({t("ads.optional")})</span>
            </FormLabel>
            <FormControl>
              <Input placeholder="Your catchy tagline here" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t("ads.onboarding_notes")} <span className="text-slate-400 font-normal">({t("ads.optional")})</span>
            </FormLabel>
            <FormControl>
              <Textarea placeholder={t("ads.onboarding_notes_placeholder")} rows={3} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <button
        className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#4F8EF7] to-[#25CB78] text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        disabled={status === "executing"}
        type="submit"
      >
        {status === "executing" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ExternalLink className="w-4 h-4" />
        )}
        {t("ads.onboarding_submit")}
      </button>
    </Form>
  );
}
