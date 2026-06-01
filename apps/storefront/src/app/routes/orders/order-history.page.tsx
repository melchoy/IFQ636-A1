import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@otbt/ui";
import { Link } from "@otbt/web";

import { getSessionToken } from "../../../modules/customers/auth/customer-auth.storage";
import {
  orderListQueryKey,
  useOrderListQuery,
} from "../../../modules/orders/orders.query";
import { OrderList } from "../../../modules/orders/ui/order-list";

export function OrderHistoryPage() {
  const queryClient = useQueryClient();
  const hasSessionToken = Boolean(getSessionToken());
  const orderListQuery = useOrderListQuery(hasSessionToken);

  useEffect(() => {
    if (!hasSessionToken) {
      queryClient.removeQueries({ queryKey: orderListQueryKey });
    }
  }, [hasSessionToken, queryClient]);

  if (!hasSessionToken) {
    return (
      <main className="storefront-container px-4 py-10 md:px-6">
        <section className="rounded-lg border bg-background p-8 text-center">
          <h1 className="text-3xl font-semibold text-foreground">Orders</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Sign in to view your previous storefront orders.
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

  if (orderListQuery.isLoading) {
    return (
      <main className="storefront-container px-4 py-10 md:px-6">
        <section className="rounded-lg border bg-background p-8 text-center">
          <p className="text-sm text-muted-foreground">Loading orders...</p>
        </section>
      </main>
    );
  }

  if (orderListQuery.isError) {
    return (
      <main className="storefront-container px-4 py-10 md:px-6">
        <section className="rounded-lg border bg-background p-8 text-center">
          <h1 className="text-3xl font-semibold text-foreground">Orders</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            We could not load your orders.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="storefront-container px-4 py-10 md:px-6">
      <OrderList orders={orderListQuery.data?.orders ?? []} />
    </main>
  );
}
