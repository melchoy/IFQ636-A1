import { useParams } from "react-router";

import { Button } from "@otbt/ui";
import { Link } from "@otbt/web";

import { getSessionToken } from "../../../modules/customers/auth/customer-auth.storage";
import { useOrderDetailQuery } from "../../../modules/orders/orders.query";
import { OrderDetail } from "../../../modules/orders/ui/order-detail";

export function OrderDetailPage() {
  const { orderId } = useParams();
  const hasSessionToken = Boolean(getSessionToken());
  const orderDetailQuery = useOrderDetailQuery(
    orderId ?? "",
    Boolean(orderId && hasSessionToken),
  );

  if (!hasSessionToken) {
    return (
      <main className="storefront-container px-4 py-10 md:px-6">
        <section className="rounded-lg border bg-card p-8 text-center">
          <h1 className="text-3xl font-semibold text-foreground">Order</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Sign in to view this order.
          </p>
          <Button asChild className="mt-6">
            <Link to="/login" unstyled>
              Sign in
            </Link>
          </Button>
        </section>
      </main>
    );
  }

  if (!orderId) {
    throw new Error("Order id is required");
  }

  if (orderDetailQuery.isLoading) {
    return (
      <main className="storefront-container px-4 py-10 md:px-6">
        <section className="rounded-lg border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">Loading order...</p>
        </section>
      </main>
    );
  }

  if (orderDetailQuery.isError || !orderDetailQuery.data) {
    return (
      <main className="storefront-container px-4 py-10 md:px-6">
        <section className="rounded-lg border bg-card p-8 text-center">
          <h1 className="text-3xl font-semibold text-foreground">Order</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            We could not load this order.
          </p>
          <Button asChild className="mt-6" variant="outline">
            <Link to="/orders" unstyled>
              Back to orders
            </Link>
          </Button>
        </section>
      </main>
    );
  }

  return <OrderDetail order={orderDetailQuery.data.order} />;
}
