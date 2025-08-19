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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Manage your profile settings</p>
      </div>

      {/* Settings Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <Form form={form} onSubmit={handleSubmit}>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {/* Username Section */}
            <div className="p-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                        <User className="size-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <FormLabel className="text-base font-medium text-gray-900 dark:text-white">
                          Username
                        </FormLabel>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          This will be your public username
                        </p>
                      </div>
                    </div>
                    
                    <div className="pl-14">
                      <FormControl>
                        <Input
                          {...field}
                          className="h-11 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter your username"
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Leave empty to use your email address
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Privacy Section */}
            <div className="p-6">
              <FormField
                control={form.control}
                name="isProfilePublic"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
                          <svg className="size-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                        <div>
                          <FormLabel className="text-base font-medium text-gray-900 dark:text-white">
                            Public Profile
                          </FormLabel>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Make your profile visible to other users
                          </p>
                        </div>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Action Section */}
            <div className="p-6 bg-gray-50 dark:bg-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Workout.cool v1.3.1
                </div>
                <Button
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                  disabled={form.formState.isSubmitting}
                  type="submit"
                >
                  {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </div>

      {/* Help Section */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <svg className="size-5 text-blue-600 dark:text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Profile Visibility
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              When your profile is public, other users can see your workout statistics and achievements. 
              You can change this setting anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
