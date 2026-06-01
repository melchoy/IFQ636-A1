import nodemailer from "nodemailer";

import { env } from "../../config/env.js";

interface SendEmailInput {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

interface SkippedEmailResult {
  status: "skipped";
  reason: string;
}

interface SentEmailResult {
  status: "sent";
  messageId: string;
  accepted: string[];
}

export type SendEmailResult = SkippedEmailResult | SentEmailResult;

function requireEmailConfig() {
  const { email } = env;

  if (!email.host || !email.port || !email.from) {
    throw new Error("Email sending is enabled but SMTP configuration is incomplete");
  }

  if ((email.user && !email.pass) || (!email.user && email.pass)) {
    throw new Error("SMTP_USER and SMTP_PASS must both be set when SMTP auth is used");
  }

  return email;
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  if (!env.email.enabled) {
    return {
      status: "skipped",
      reason: "Email sending is disabled",
    };
  }

  const emailConfig = requireEmailConfig();
  const transport = nodemailer.createTransport({
    auth:
      emailConfig.user && emailConfig.pass
        ? {
            pass: emailConfig.pass,
            user: emailConfig.user,
          }
        : undefined,
    host: emailConfig.host,
    port: emailConfig.port,
  });

  const result = await transport.sendMail({
    from: emailConfig.from,
    html: input.html,
    subject: input.subject,
    text: input.text,
    to: input.to,
  });

  return {
    status: "sent",
    accepted: result.accepted.map(String),
    messageId: result.messageId,
  };
}
