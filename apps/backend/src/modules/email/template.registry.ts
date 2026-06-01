import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export interface EmailTemplateFilePair {
  htmlTemplatePath: string;
  textTemplatePath: string;
}

export function defineEmailTemplateRegistry<TTemplates extends Record<string, string>>(input: {
  moduleName: string;
  registryMetaUrl: string;
  templates: TTemplates;
}) {
  const registryDir = path.dirname(fileURLToPath(input.registryMetaUrl));
  const sourceTemplateDir = path.resolve(registryDir, "templates");
  const bundledTemplateDir = path.resolve(
    registryDir,
    "module-emails",
    input.moduleName,
    "templates",
  );

  const resolveTemplatePath = (templateName: string, fileName: string) => {
    const sourcePath = path.join(sourceTemplateDir, templateName, fileName);

    if (existsSync(sourcePath)) {
      return sourcePath;
    }

    return path.join(bundledTemplateDir, templateName, fileName);
  };

  return Object.fromEntries(
    Object.entries(input.templates).map(([templateKey, templateName]) => [
      templateKey,
      {
        htmlTemplatePath: resolveTemplatePath(templateName, "body.html"),
        textTemplatePath: resolveTemplatePath(templateName, "body.txt"),
      },
    ]),
  ) as {
    [K in keyof TTemplates]: EmailTemplateFilePair;
  };
}
