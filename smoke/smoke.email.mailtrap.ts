import assert from "node:assert/strict";

import { sendEmail } from "../apps/backend/src/modules/email/email.service.js";

const to = process.env.SMTP_TEST_TO;

assert.ok(to, "SMTP_TEST_TO is required for the Mailtrap smoke test");

const result = await sendEmail({
  html: `
    <h1>Mailtrap smoke test</h1>
    <p>This message verifies backend SMTP email sending.</p>
  `,
  subject: "OTBT Mailtrap smoke test",
  text: "This message verifies backend SMTP email sending.",
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
