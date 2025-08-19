"use client";

import { useEffect, useState } from "react";
import { User, CheckCircle } from "lucide-react";

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
        <p className="mt-2 text-gray-600 dark:text-gray-400">Manage your profile settings</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <Form form={form} onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            {/* Username Section */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-medium text-gray-900 dark:text-white">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="h-11 px-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Enter your username"
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Leave empty to use your email
                  </p>
                </FormItem>
              )}
            />

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-700"></div>

            {/* Public Profile Section */}
            <FormField
              control={form.control}
              name="isProfilePublic"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <FormLabel className="text-sm font-medium text-gray-900 dark:text-white">
                        Public Profile
                      </FormLabel>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Make your profile visible to other users
                      </p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 rounded-b-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Workout.cool v1.3.1
              </span>
              <Button
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50"
                disabled={form.formState.isSubmitting}
                type="submit"
              >
                {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};
