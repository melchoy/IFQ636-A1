import { ReceiptText } from "lucide-react";

import type { OrderHistoryItem } from "@otbt/types";

import { Button } from "@otbt/ui";
import { Link } from "@otbt/web";

import { StorefrontEmptyState } from "../../common/storefront-empty-state";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(price);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatOrderStatus(status: string) {
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function OrderStatusBadge({ status }: { status: string }) {
  const statusClassName =
    status === "packed"
      ? "border-blue-200 bg-blue-50 text-blue-700"
      : status === "shipped"
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : "border-border bg-muted text-muted-foreground";

  return (
    <span
      className={`inline-flex w-fit rounded-full border px-2.5 py-1 text-xs font-medium ${statusClassName}`}
    >
      {formatOrderStatus(status)}
    </span>
  );
}

function OrderRow({ order }: { order: OrderHistoryItem }) {
  return (
    <article className="grid gap-4 border-b py-5 last:border-b-0 md:grid-cols-[minmax(0,1.4fr)_minmax(180px,1fr)_120px_120px] md:items-center">
      <div className="min-w-0">
        <Link
          className="text-sm font-semibold text-foreground hover:underline"
          to={`/orders/${order.id}`}
        >
          Order {order.reference}
        </Link>
        <p className="mt-1 text-sm text-muted-foreground">
          {formatDate(order.createdAt)}
        </p>
      </div>
      <p className="text-sm text-muted-foreground">
        {order.itemSummary ||
          `${order.itemCount} ${order.itemCount === 1 ? "item" : "items"}`}
      </p>
      <p className="text-sm font-semibold text-foreground">
        {formatPrice(order.total)}
      </p>
      <OrderStatusBadge status={order.status} />
    </article>
  );
}

export function OrderList({ orders }: { orders: OrderHistoryItem[] }) {
  if (orders.length === 0) {
    return (
      <StorefrontEmptyState
        description="Orders you place through this storefront will appear here."
        icon={ReceiptText}
        label="No orders yet"
        title="You have not placed an order."
        actions={
          <Button asChild className="h-10 min-w-[168px] px-4">
            <Link to="/" unstyled>
              Browse catalogue
            </Link>
          </Button>
        }
      />
    );
  }

  return (
    <section>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-foreground">Orders</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Review previous orders placed through the storefront.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </p>
      </div>

      <div className="mt-8 rounded-lg border bg-card px-5">
        <div className="hidden border-b py-3 text-xs font-medium uppercase text-muted-foreground md:grid md:grid-cols-[minmax(0,1.4fr)_minmax(180px,1fr)_120px_120px]">
          <span>Order</span>
          <span>Summary</span>
          <span>Total</span>
          <span>Status</span>
        </div>
        {orders.map((order) => (
          <OrderRow key={order.id} order={order} />
        ))}
      </div>
    </section>
  );
}
