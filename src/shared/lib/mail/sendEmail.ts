import nodemailer from "nodemailer";
import { render } from "@react-email/components";

import { env } from "@/env";

type EmailPayload = {
  from?: string;
  to: string;
  subject: string;
  text: string;
  react?: React.ReactElement;
};

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE,
  auth:
    env.SMTP_USER && env.SMTP_PASS
      ? {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        }
      : undefined,
});

export const sendEmail = async ({ from, to, subject, text, react }: EmailPayload) => {
  try {
    return transporter.sendMail({
      from: from ?? env.SMTP_FROM,
      to,
      subject,
      text,
      html: react ? await render(react) : undefined,
    });
  } catch (error) {
    console.error(error);
  }
};
