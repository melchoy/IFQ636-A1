import { useLoaderData, useNavigate } from "react-router";
import { Link } from "@otbt/web";

import type { AdminCustomerUpdateRequest as CustomerUpdateRequest } from "@otbt/types";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
} from "@otbt/ui";

import {
  CustomerForm,
  useCustomerDetail,
  useUpdateCustomer,
} from "../../../modules/customers";

type CustomerEditLoaderData = {
  customerId: string;
};

export function CustomerEditPage() {
  const { customerId } = useLoaderData() as CustomerEditLoaderData;
  const { customer } = useCustomerDetail(customerId);
  const navigate = useNavigate();
  const updateCustomer = useUpdateCustomer(customerId);
  const customerName = `${customer.firstName} ${customer.lastName}`;

  async function saveCustomer(customerDraft: CustomerUpdateRequest) {
    await updateCustomer.mutateAsync(customerDraft);
    navigate("/customers");
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <Link
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  to="/customers"
                >
                  Customers
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{customerName}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              {customerName}
            </h1>
            <p className="text-sm text-muted-foreground md:text-base">
              Update customer account status and storefront access.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button asChild variant="outline">
            <Link to="/customers" unstyled>
              Cancel
            </Link>
          </Button>
          <Button
            disabled={updateCustomer.isPending}
            form="customer-edit-form"
            type="submit"
          >
            {updateCustomer.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <CustomerForm
        defaultValues={customer}
        error={updateCustomer.error}
        formId="customer-edit-form"
        onSubmit={saveCustomer}
        submitting={updateCustomer.isPending}
      />
    </section>
  );
}
