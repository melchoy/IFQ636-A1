import type { OrderHistoryItem } from "@otbt/types";

import { Button } from "@otbt/ui";
import { Link } from "@otbt/web";

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
  return (
    <span className="inline-flex rounded-full border px-2.5 py-1 text-xs font-medium text-foreground">
      {formatOrderStatus(status)}
    </span>
  );
}

function OrderRow({ order }: { order: OrderHistoryItem }) {
  return (
    <article className="grid gap-4 border-b py-5 last:border-b-0 md:grid-cols-[minmax(0,1fr)_120px_120px_140px] md:items-center">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground">
          Order {order.reference}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {formatDate(order.createdAt)}
        </p>
      </div>
      <p className="text-sm text-muted-foreground">
        {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
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
      <section className="rounded-lg border bg-background p-8 text-center">
        <h1 className="text-3xl font-semibold text-foreground">Orders</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Orders you place through this storefront will appear here.
        </p>
        <Button asChild className="mt-6">
          <Link to="/" unstyled>
            Browse catalogue
          </Link>
        </Button>
      </section>
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

      <div className="mt-8 rounded-lg border bg-background px-5">
        <div className="hidden border-b py-3 text-xs font-medium uppercase text-muted-foreground md:grid md:grid-cols-[minmax(0,1fr)_120px_120px_140px]">
          <span>Order</span>
          <span>Items</span>
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
