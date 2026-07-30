"use server";

import { EmailActionSchema } from "./email.schema";

import { actionClient } from "@/shared/api/safe-actions";


// export const addEmailAction = action(EmailActionSchema, async ({ email }) => {
//   try {
//     const userData = {
//       email,
//     };

//     const stripeCustomerId = await setupStripeCustomer(userData);
//     const resendContactId = await setupResendCustomer(userData);

//     await prisma.user.create({
//       data: {
//         ...userData,
//         stripeCustomerId,
//         resendContactId,
//       },
//     });

//     return { email };
//   } catch (error) {
//     throw new ActionError("The email is already in use");
//   }
// });

export const addEmailAction = actionClient.schema(EmailActionSchema).action(async ({ parsedInput: { email } }) => {
  return { email };
});
