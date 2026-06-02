import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@otbt/ui";

type StorefrontEmptyStateProps = {
  icon: LucideIcon;
  label: string;
  title: string;
  description: ReactNode;
  actions?: ReactNode;
  className?: string;
  panelClassName?: string;
};

export function StorefrontEmptyState({
  icon: Icon,
  label,
  title,
  description,
  actions,
  className,
  panelClassName,
}: StorefrontEmptyStateProps) {
  return (
    <section
      className={cn(
        "flex min-h-[480px] flex-col items-center justify-center rounded-lg border bg-card px-6 py-16 text-center",
        panelClassName,
      )}
    >
      <div className="flex size-[124px] items-center justify-center rounded-[10px] border border-product-image-well-border bg-[color-mix(in_oklab,var(--bt-obsidian)_82%,transparent)]">
        <Icon
          aria-hidden="true"
          className="size-[54px] text-primary"
          strokeWidth={1.25}
        />
      </div>

      <p className="mt-8 text-[13px] font-semibold uppercase tracking-wide text-primary">
        {label}
      </p>
      <h1 className="mt-4 text-[34px] font-bold leading-[42px] text-foreground">
        {title}
      </h1>
      <p className="mt-4 max-w-[500px] text-[17px] leading-[26px] text-muted-foreground">
        {description}
      </p>

      {actions ? (
        <div
          className={cn(
            "mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row",
            className,
          )}
        >
          {actions}
        </div>
      ) : null}
    </section>
  );
}
