import { defineEmailTemplateRegistry } from "../../email/template.registry.js";

export const orderEmailRegistry = defineEmailTemplateRegistry({
  moduleName: "orders",
  registryMetaUrl: import.meta.url,
  templates: {
    orderConfirmation: "order-confirmation",
    orderStatusUpdate: "order-status-update",
  },
});
