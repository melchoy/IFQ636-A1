import type { FormEvent } from "react";
import { useState } from "react";

import { ORDER_STATUSES, type OrderStatus } from "@otbt/types";
import { Button, Select } from "@otbt/ui";

interface OrderStatusFormProps {
  defaultStatus: OrderStatus;
  error: Error | null;
  onSubmit: (status: OrderStatus) => Promise<void>;
  submitting: boolean;
}

const statusLabels: Record<OrderStatus, string> = {
  pending: "Pending",
  packed: "Packed",
  shipped: "Shipped",
};

export function OrderStatusForm({
  defaultStatus,
  error,
  onSubmit,
  submitting,
}: OrderStatusFormProps) {
  const [status, setStatus] = useState<OrderStatus>(defaultStatus);

  async function submitStatus(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit(status);
  }

  return (
    <form className="space-y-4" onSubmit={submitStatus}>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium leading-none" htmlFor="order-status">
          Status
        </label>
        <Select
          disabled={submitting}
          id="order-status"
          onChange={(event) => setStatus(event.currentTarget.value as OrderStatus)}
          value={status}
        >
          {ORDER_STATUSES.map((orderStatus) => (
            <option key={orderStatus} value={orderStatus}>
              {statusLabels[orderStatus]}
            </option>
          ))}
        </Select>
      </div>

      {error ? <p className="text-sm text-destructive">{error.message}</p> : null}

      <Button disabled={submitting || status === defaultStatus} type="submit">
        {submitting ? "Saving..." : "Update status"}
      </Button>
    </form>
  );
}
