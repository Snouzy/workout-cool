"use client";

import { useEffect } from "react";
import { User } from "lucide-react";

import { useI18n } from "locales/client";
import { settingsSchema, type SettingsFormData } from "@/features/settings/schema/settings.schema";
import { updateSettingsAction } from "@/features/settings/actions/update-settings.action";
import { getUserSettingsAction } from "@/features/settings/actions/get-user-settings.action";
import { brandedToast } from "@/components/ui/toast";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, useZodForm } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export const SettingsPage = () => {
  const t = useI18n();

  const form = useZodForm({
    schema: settingsSchema,
    defaultValues: {
      username: "",
      isProfilePublic: true,
    },
  });

  useEffect(() => {
    const loadUserSettings = async () => {
      const result = await getUserSettingsAction();
      if (result && !result.error) {
        form.reset({
          username: result.username,
          isProfilePublic: result.isProfilePublic,
        });
      }
    };

    loadUserSettings();
  }, [form]);

  const handleSubmit = async (values: SettingsFormData) => {
    try {
      const result = await updateSettingsAction(values);

      if (result?.serverError) {
        brandedToast({ title: t(result.serverError as keyof typeof t), variant: "error" });
        return;
      }

      brandedToast({ title: t("success.settings_updated_successfully"), variant: "success" });
    } catch (error) {
      brandedToast({ title: t("error.generic_error"), variant: "error" });
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Manage your account settings and preferences.</p>
      </div>

      <div className="rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
        <Form form={form} onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-gray-900 dark:text-gray-100">Username</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input {...field} className="pl-10" placeholder="Enter your username" />
                    </FormControl>
                    <User className="absolute left-3 top-3 size-4 text-gray-400" />
                  </div>
                  <FormMessage />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    This will be your public username. Leave empty to use your email.
                  </p>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isProfilePublic"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between py-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm font-medium text-gray-900 dark:text-gray-100">Public Profile</FormLabel>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Make your profile visible to other users</p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button className="min-w-[100px]" disabled={form.formState.isSubmitting} type="submit">
                {form.formState.isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};
