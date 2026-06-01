import { defineEmailTemplateRegistry } from "../../email/template.registry.js";

export const customerEmailRegistry = defineEmailTemplateRegistry({
  moduleName: "customers",
  registryMetaUrl: import.meta.url,
  templates: {
    accountRegistration: "account-registration",
  },
});
