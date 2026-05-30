import type { ComponentProps } from "react";
import { Link } from "react-router";
import { MoreHorizontal } from "lucide-react";

import type {
  AdminCustomerListItem as CustomerListItem,
  CustomerAccessLevel,
  CustomerStatus,
} from "@otbt/types";
import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@otbt/ui";

import { useUpdateCustomer } from "../customers.hooks";

interface CustomerListProps {
  customers: CustomerListItem[];
}

const statusConfig: Record<
  CustomerStatus,
  { variant: ComponentProps<typeof Badge>["variant"]; label: string }
> = {
  active: { variant: "default", label: "Active" },
  disabled: { variant: "secondary", label: "Disabled" },
};

const accessLevelLabels: Record<CustomerAccessLevel, string> = {
  standard: "Standard",
  member: "Member",
};

export function CustomerList({ customers }: CustomerListProps) {
  if (customers.length === 0) {
    return (
      <div className="rounded-md border bg-background px-4 py-10 text-center">
        <p className="text-sm font-medium text-foreground">No customers found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Registered customers will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <table className="w-full min-w-[860px] table-fixed caption-bottom text-sm">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
            <th className="h-12 w-[58%] px-4 text-left align-middle font-medium text-muted-foreground">
              Customer
            </th>
            <th className="h-12 w-[12%] px-4 text-left align-middle font-medium text-muted-foreground">
              Status
            </th>
            <th className="h-12 w-[12%] px-4 text-left align-middle font-medium text-muted-foreground">
              Access
            </th>
            <th className="h-12 w-[14%] px-4 text-left align-middle font-medium text-muted-foreground">
              Updated
            </th>
            <th className="h-12 w-[52px] px-4 text-right align-middle font-medium text-muted-foreground" />
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {customers.map((customer) => {
            const { variant, label } = statusConfig[customer.status];

            return (
              <tr
                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                key={customer.id}
              >
                <td className="p-4 align-middle">
                  <Link
                    className="font-medium text-foreground transition-colors hover:text-primary"
                    to={`/customers/${customer.id}`}
                  >
                    {customer.firstName} {customer.lastName}
                  </Link>
                  <p className="text-xs text-muted-foreground">{customer.email}</p>
                </td>
                <td className="whitespace-nowrap p-4 align-middle">
                  <Badge variant={variant}>{label}</Badge>
                </td>
                <td className="whitespace-nowrap p-4 align-middle">
                  {accessLevelLabels[customer.accessLevel]}
                </td>
                <td className="whitespace-nowrap p-4 align-middle text-muted-foreground">
                  {new Date(customer.updatedAt).toLocaleDateString()}
                </td>
                <td className="p-4 text-right align-middle">
                  <CustomerActions customer={customer} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function CustomerActions({ customer }: { customer: CustomerListItem }) {
  const updateCustomer = useUpdateCustomer(customer.id);
  const nextStatus = customer.status === "active" ? "disabled" : "active";

  function updateStatus() {
    void updateCustomer.mutateAsync({ status: nextStatus });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-8 w-8" size="icon" type="button" variant="ghost">
          <MoreHorizontal className="size-4" />
          <span className="sr-only">
            Open menu for {customer.firstName} {customer.lastName}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
        <DropdownMenuItem asChild>
          <Link to={`/customers/${customer.id}`}>
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled={updateCustomer.isPending} onSelect={updateStatus}>
          {nextStatus === "active" ? "Enable account" : "Disable account"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
