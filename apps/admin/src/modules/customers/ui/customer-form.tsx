import type { FormEvent } from "react";
import { useState } from "react";

import type {
  AdminCustomerDetail as CustomerDetail,
  AdminCustomerUpdateRequest as CustomerUpdateRequest,
  CustomerAccessLevel,
  CustomerStatus,
} from "@otbt/types";
import { Input } from "@otbt/ui";

interface CustomerFormProps {
  defaultValues: CustomerDetail;
  error: Error | null;
  formId: string;
  onSubmit: (customer: CustomerUpdateRequest) => Promise<void>;
  submitting: boolean;
}

type CustomerDraft = CustomerUpdateRequest;

const statusLabels: Record<CustomerStatus, string> = {
  active: "Active",
  disabled: "Disabled",
};

const accessLevelLabels: Record<CustomerAccessLevel, string> = {
  standard: "Standard",
  member: "Member",
};

export function CustomerForm({
  defaultValues,
  error,
  formId,
  onSubmit,
  submitting,
}: CustomerFormProps) {
  const [draftCustomer, setDraftCustomer] = useState<CustomerDraft>({
    firstName: defaultValues.firstName,
    lastName: defaultValues.lastName,
    email: defaultValues.email,
    status: defaultValues.status,
    accessLevel: defaultValues.accessLevel,
  });

  function updateDraft<CustomerField extends keyof CustomerDraft>(
    field: CustomerField,
    value: CustomerDraft[CustomerField],
  ) {
    setDraftCustomer((currentDraft) => ({
      ...currentDraft,
      [field]: value,
    }));
  }

  async function submitCustomer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit(draftCustomer);
  }

  return (
    <form
      className="rounded-lg border bg-background p-6 shadow-xs"
      id={formId}
      onSubmit={submitCustomer}
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium leading-none" htmlFor={`${formId}-first-name`}>
            First name
          </label>
          <Input
            disabled={submitting}
            id={`${formId}-first-name`}
            onChange={(event) => updateDraft("firstName", event.currentTarget.value)}
            required
            value={draftCustomer.firstName ?? ""}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium leading-none" htmlFor={`${formId}-last-name`}>
            Last name
          </label>
          <Input
            disabled={submitting}
            id={`${formId}-last-name`}
            onChange={(event) => updateDraft("lastName", event.currentTarget.value)}
            required
            value={draftCustomer.lastName ?? ""}
          />
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-sm font-medium leading-none" htmlFor={`${formId}-email`}>
            Email
          </label>
          <Input
            disabled={submitting}
            id={`${formId}-email`}
            onChange={(event) => updateDraft("email", event.currentTarget.value)}
            required
            type="email"
            value={draftCustomer.email ?? ""}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium leading-none" htmlFor={`${formId}-status`}>
            Status
          </label>
          <select
            className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            disabled={submitting}
            id={`${formId}-status`}
            onChange={(event) =>
              updateDraft("status", event.currentTarget.value as CustomerStatus)
            }
            value={draftCustomer.status}
          >
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium leading-none" htmlFor={`${formId}-access-level`}>
            Access
          </label>
          <select
            className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            disabled={submitting}
            id={`${formId}-access-level`}
            onChange={(event) =>
              updateDraft("accessLevel", event.currentTarget.value as CustomerAccessLevel)
            }
            value={draftCustomer.accessLevel}
          >
            {Object.entries(accessLevelLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error ? (
        <p className="mt-4 text-sm text-destructive">{error.message}</p>
      ) : null}
    </form>
  );
}
