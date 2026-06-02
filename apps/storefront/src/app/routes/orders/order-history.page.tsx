import { useEffect } from "react";
import { AlertCircle, LogIn } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@otbt/ui";
import { Link } from "@otbt/web";

import { StorefrontEmptyState } from "../../../modules/common/storefront-empty-state";
import { StorefrontPage } from "../../../modules/common/storefront-page";
import { getSessionToken } from "../../../modules/customers/auth/customer-auth.storage";
import {
  orderListQueryKey,
  useOrderListQuery,
} from "../../../modules/orders/orders.query";
import { OrderList } from "../../../modules/orders/ui/order-list";

const ordersBreadcrumbs = [
  { label: "Account" },
  { label: "Orders" },
] as const;

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
      <StorefrontPage breadcrumbs={[...ordersBreadcrumbs]}>
        <div className="mt-4">
          <StorefrontEmptyState
            description="Sign in to view your previous storefront orders."
            icon={LogIn}
            label="Sign in required"
            title="Your orders are private."
            actions={
              <Button asChild className="h-10 min-w-[168px] px-4">
                <Link to="/login" unstyled>
                  Sign in
                </Link>
              </Button>
            }
          />
        </div>
      </StorefrontPage>
    );
  }

  if (orderListQuery.isLoading) {
    return (
      <StorefrontPage breadcrumbs={[...ordersBreadcrumbs]}>
        <div className="mt-4 rounded-lg border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">Loading orders...</p>
        </div>
      </StorefrontPage>
    );
  }

  if (orderListQuery.isError) {
    return (
      <StorefrontPage breadcrumbs={[...ordersBreadcrumbs]}>
        <div className="mt-4">
          <StorefrontEmptyState
            description="We could not load your orders. Try again in a moment."
            icon={AlertCircle}
            label="Unable to load"
            title="Something went wrong."
            actions={
              <Button
                className="h-10 min-w-[168px] px-4"
                onClick={() => orderListQuery.refetch()}
                type="button"
              >
                Try again
              </Button>
            }
          />
        </div>
      </StorefrontPage>
    );
  }

  return (
    <StorefrontPage breadcrumbs={[...ordersBreadcrumbs]}>
      <div className="mt-4">
        <OrderList orders={orderListQuery.data?.orders ?? []} />
      </div>
    </StorefrontPage>
  );
}
