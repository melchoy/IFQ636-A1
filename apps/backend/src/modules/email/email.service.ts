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

  if (!email.host || !email.port || !email.user || !email.pass || !email.from) {
    throw new Error("Email sending is enabled but SMTP configuration is incomplete");
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
    auth: {
      pass: emailConfig.pass,
      user: emailConfig.user,
    },
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
