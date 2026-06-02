import type { ReactNode } from "react";
import { ImageIcon } from "lucide-react";

import { cn } from "@otbt/ui";

type ProductImageWellProps = {
  alt: string;
  imageUrl?: string | null;
  className?: string;
  imageClassName?: string;
  iconClassName?: string;
  children?: ReactNode;
};

export function ProductImageWell({
  alt,
  imageUrl,
  className,
  imageClassName,
  iconClassName,
  children,
}: ProductImageWellProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-product-image-well-border bg-product-image-well",
        className,
      )}
    >
      {children ??
        (imageUrl ? (
          <img
            alt={alt}
            className={cn(
              "object-contain object-center",
              imageClassName ?? "max-h-full max-w-full",
            )}
            src={imageUrl}
          />
        ) : (
          <ImageIcon
            aria-hidden="true"
            className={cn("text-muted-foreground", iconClassName ?? "size-8")}
          />
        ))}
    </div>
  );
}
