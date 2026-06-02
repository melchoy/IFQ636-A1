import { Fragment } from "react";

import { cn } from "@otbt/ui";
import { Link } from "@otbt/web";

export type StorefrontBreadcrumbItem = {
  label: string;
  to?: string;
};

type StorefrontBreadcrumbsProps = {
  items: StorefrontBreadcrumbItem[];
  className?: string;
};

export function StorefrontBreadcrumbs({
  items,
  className,
}: StorefrontBreadcrumbsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className={cn("text-[13px] text-muted-foreground", className)}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <Fragment key={`${item.label}-${index}`}>
              {index > 0 ? (
                <li aria-hidden="true" className="text-muted-foreground/70">
                  /
                </li>
              ) : null}
              <li className={isLast ? "text-muted-foreground" : undefined}>
                {item.to && !isLast ? (
                  <Link
                    className="font-normal transition-colors hover:text-foreground"
                    to={item.to}
                    unstyled
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className={isLast ? "text-muted-foreground" : undefined}>
                    {item.label}
                  </span>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
