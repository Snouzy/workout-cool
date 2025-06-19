"use client";

import { AlertCircle, CheckCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";

import { LoadingButton } from "@/features/form/SubmitButton";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage, useZodForm } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { EmailActionSchema } from "./email.schema";
import { addEmailAction } from "./email.action";

import type { EmailActionSchemaType } from "./email.schema";

export type EmailFormProps = {
  submitButtonLabel?: string;
  successMessage?: string;
};

export const EmailForm = ({
  submitButtonLabel = "Subscribe",
  successMessage = "You have subscribed to our newsletter.",
}: EmailFormProps) => {
  const form = useZodForm({
    schema: EmailActionSchema,
  });

  const submit = useMutation({
    mutationFn: async ({ email }: EmailActionSchemaType) => {
      const action = await addEmailAction({ email });

      if (action?.data) {
        return action.data;
      } else {
        throw new Error(action?.serverError ?? "An error occurred while subscribing to the newsletter.");
      }
    },
  });

  return (
    <AnimatePresence mode="wait">
      {submit.isSuccess ? (
        <motion.div
          animate={{
            height: "auto",
            opacity: 1,
          }}
          initial={{
            height: 0,
            opacity: 0,
          }}
          key="success"
        >
          <Alert variant="success">
            <CheckCircle size={20} />
            <AlertTitle>{successMessage}</AlertTitle>
          </Alert>
        </motion.div>
      ) : (
        <motion.div
          animate={{
            height: "auto",
            opacity: 1,
          }}
          exit={{
            height: 0,
            opacity: 0,
          }}
          key="form"
        >
          <Form className="flex flex-col gap-4" disabled={submit.isPending} form={form} onSubmit={async (v) => submit.mutate(v)}>
            <div className="flex items-center gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="relative w-full">
                    <FormControl>
                      <Input
                        className="rounded-lg border-accent-foreground/20 bg-accent px-4 py-6 text-lg focus-visible:ring-foreground"
                        placeholder="Ton email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="absolute -bottom-5" />
                  </FormItem>
                )}
              />
              <LoadingButton className="px-4 py-6 text-lg font-normal" loading={submit.isPending} variant="default">
                {submitButtonLabel}
              </LoadingButton>
            </div>
            {submit.isError && (
              <Alert variant="error">
                <AlertCircle size={20} />
                <AlertTitle>{submit.error.message}</AlertTitle>
                <AlertDescription>Try another email address or contact us.</AlertDescription>
              </Alert>
            )}
          </Form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
