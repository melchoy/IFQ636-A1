import type { ReactNode } from "react";

import { cn } from "@otbt/ui";

import {
  StorefrontBreadcrumbs,
  type StorefrontBreadcrumbItem,
} from "./storefront-breadcrumbs";

type StorefrontPageProps = {
  breadcrumbs?: StorefrontBreadcrumbItem[];
  children: ReactNode;
  className?: string;
};

export function StorefrontPage({
  breadcrumbs,
  children,
  className,
}: StorefrontPageProps) {
  return (
    <main
      className={cn(
        "storefront-container px-4 py-4 sm:py-5 md:px-6 lg:py-6",
        className,
      )}
    >
      {breadcrumbs && breadcrumbs.length > 0 ? (
        <StorefrontBreadcrumbs items={breadcrumbs} />
      ) : null}
      {children}
    </main>
  );
}
