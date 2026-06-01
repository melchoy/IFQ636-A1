import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { EmailTemplateFilePair } from "./template.registry.js";

export interface RenderedEmail {
  subject: string;
  text: string;
  html: string;
}

interface TemplateFileInput {
  emailType?: string;
  subject: string;
  preheader: string;
  htmlTemplatePath: string;
  textTemplatePath: string;
  htmlValues?: Record<string, string>;
  values?: Record<string, string>;
}

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const sourceTemplateDir = path.resolve(moduleDir, "templates");
const bundledTemplateDir = path.resolve(moduleDir, "email-templates");

export function resolveTemplatePath(metaUrl: string, ...segments: string[]) {
  return path.resolve(path.dirname(fileURLToPath(metaUrl)), ...segments);
}

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function readLayoutTemplate() {
  const sourcePath = path.join(sourceTemplateDir, "layout.html");
  const bundledPath = path.join(bundledTemplateDir, "layout.html");

  try {
    return await readFile(sourcePath, "utf8");
  } catch {
    return readFile(bundledPath, "utf8");
  }
}

function renderTemplate(source: string, values: Record<string, string>) {
  return source.replaceAll(/\{\{([a-zA-Z0-9_]+)\}\}/g, (_match, key: string) => {
    return values[key] ?? "";
  });
}

export async function renderEmailFromTemplateFiles(
  input: TemplateFileInput,
): Promise<RenderedEmail> {
  const layoutTemplate = await readLayoutTemplate();
  const rawHtmlBody = await readFile(input.htmlTemplatePath, "utf8");
  const rawTextBody = await readFile(input.textTemplatePath, "utf8");
  const values = input.values ?? {};
  const htmlValues = Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, escapeHtml(value)]),
  );
  const htmlBody = renderTemplate(rawHtmlBody, {
    ...htmlValues,
    ...(input.htmlValues ?? {}),
  });
  const text = renderTemplate(rawTextBody, values);

  return {
    subject: input.subject,
    text,
    html: renderTemplate(layoutTemplate, {
      emailType: escapeHtml(input.emailType ?? "Email"),
      content: htmlBody,
      preheader: escapeHtml(input.preheader),
      title: escapeHtml(input.subject),
    }),
  };
}

export async function renderRegisteredEmailTemplate(
  input: Omit<TemplateFileInput, "htmlTemplatePath" | "textTemplatePath"> & {
    template: EmailTemplateFilePair;
  },
): Promise<RenderedEmail> {
  return renderEmailFromTemplateFiles({
    ...input,
    htmlTemplatePath: input.template.htmlTemplatePath,
    textTemplatePath: input.template.textTemplatePath,
  });
}
