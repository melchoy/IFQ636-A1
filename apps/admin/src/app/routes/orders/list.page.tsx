import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@otbt/ui";

import { OrderList, useOrderList } from "../../../modules/orders";

export function OrderListPage() {
  const orderList = useOrderList();

  return (
    <section className="flex w-full flex-col gap-6">
      <div className="space-y-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Storefront</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Orders</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Orders</h1>
          <p className="text-sm text-muted-foreground md:text-base">
            Review submitted checkout orders and fulfilment status.
          </p>
        </div>
      </div>

      <OrderList orders={orderList.orders} />
    </section>
  );
}
