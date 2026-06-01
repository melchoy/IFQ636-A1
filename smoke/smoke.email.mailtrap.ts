import assert from "node:assert/strict";

import { sendEmail } from "../apps/backend/src/modules/email/email.service.js";
import {
  renderEmailFromTemplateFiles,
  resolveTemplatePath,
} from "../apps/backend/src/modules/email/email.templates.js";

const to = process.env.SMTP_TEST_TO;

assert.ok(to, "SMTP_TEST_TO is required for the Mailtrap smoke test");

const renderedEmail = await renderEmailFromTemplateFiles({
  emailType: "Smoke test",
  htmlTemplatePath: resolveTemplatePath(
    import.meta.url,
    "templates",
    "mailtrap-smoke",
    "body.html",
  ),
  preheader: "This message verifies backend SMTP email sending.",
  subject: "OTBT Mailtrap smoke test",
  textTemplatePath: resolveTemplatePath(
    import.meta.url,
    "templates",
    "mailtrap-smoke",
    "body.txt",
  ),
});

const result = await sendEmail({
  ...renderedEmail,
  to,
});

assert.equal(result.status, "sent", JSON.stringify(result));

console.log(
  JSON.stringify(
    {
      ok: true,
      result,
    },
    null,
    2,
  ),
);
