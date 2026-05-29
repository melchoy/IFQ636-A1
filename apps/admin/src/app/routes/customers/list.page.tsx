import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@otbt/ui";

import { CustomerList, useCustomerList } from "../../../modules/customers";

export function CustomerListPage() {
  const customerList = useCustomerList();

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
              <BreadcrumbPage>Customers</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Customers</h1>
          <p className="text-sm text-muted-foreground md:text-base">
            Manage customer accounts, status, and storefront access.
          </p>
        </div>
      </div>

      <CustomerList customers={customerList.customers} />
    </section>
  );
}
