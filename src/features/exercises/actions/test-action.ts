"use server";

import { z } from "zod";
import { authenticatedActionClient } from "@/shared/api/safe-actions";

const testSchema = z.object({
  message: z.string(),
});

export const testAction = authenticatedActionClient
  .schema(testSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { user } = ctx;
    const { message } = parsedInput;

    console.log("Test action called with:", { message, userId: user.id });
    
    return { success: true, data: { message, userId: user.id } };
  });