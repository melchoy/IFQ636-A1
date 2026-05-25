import type { ComponentProps } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router";
import { MoreHorizontal } from "lucide-react";

import type { AdminProductListItem as ProductListItem } from "@otbt/types";
import { Badge, Button } from "@otbt/ui";

interface ProductListProps {
  products: ProductListItem[];
}

type ProductStatus = ProductListItem["status"];
type ProductVisibility = ProductListItem["visibility"];

const statusConfig: Record<ProductStatus, { variant: ComponentProps<typeof Badge>["variant"]; label: string }> = {
  active: { variant: "default", label: "Active" },
  draft: { variant: "outline", label: "Draft" },
  archived: { variant: "secondary", label: "Archived" },
};

const visibilityLabels: Record<ProductVisibility, string> = {
  public: "Public",
  members_only: "Members only",
  hidden: "Hidden",
};

export function ProductList({ products }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-md border bg-background px-4 py-10 text-center">
        <p className="text-sm font-medium text-foreground">No products found</p>
        <p className="mt-1 text-sm text-muted-foreground">Seed products or create a product to populate the catalogue.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <table className="w-full min-w-[860px] caption-bottom text-sm">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
            <th className="h-12 w-[40%] px-4 text-left align-middle font-medium text-muted-foreground">
              Product
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Price</th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Stock</th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Visibility</th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Updated</th>
            <th className="h-12 w-[52px] px-4 text-left align-middle font-medium text-muted-foreground" />
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {products.map((product) => {
            const { variant, label } = statusConfig[product.status];

            return (
              <tr
                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                key={product.id}
              >
                <td className="p-4 align-middle">
                  <Link
                    className="font-medium text-foreground transition-colors hover:text-primary"
                    to={`/products/${product.id}`}
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">SKU {product.sku}</p>
                </td>
                <td className="p-4 align-middle">${product.price.toFixed(2)}</td>
                <td className="p-4 align-middle">{product.stock}</td>
                <td className="p-4 align-middle">
                  <Badge variant={variant}>{label}</Badge>
                </td>
                <td className="p-4 align-middle">{visibilityLabels[product.visibility]}</td>
                <td className="p-4 align-middle text-muted-foreground">
                  {new Date(product.updatedAt).toLocaleDateString()}
                </td>
                <td className="p-4 align-middle">
                  <ProductActions product={product} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ProductActions({ product }: { product: ProductListItem }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <div className="relative" ref={menuRef}>
      <Button
        aria-controls={open ? menuId : undefined}
        aria-expanded={open}
        aria-haspopup="menu"
        className="h-8 w-8"
        onClick={() => setOpen((currentOpen) => !currentOpen)}
        size="icon"
        type="button"
        variant="ghost"
      >
        <MoreHorizontal className="size-4" />
        <span className="sr-only">Open menu for {product.name}</span>
      </Button>

      {open ? (
        <div
          className="absolute right-0 z-50 mt-2 min-w-40 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
          id={menuId}
          role="menu"
        >
          <Link
            className="flex w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
            onClick={closeMenu}
            role="menuitem"
            to={`/products/${product.id}`}
          >
            Edit
          </Link>
          <button
            className="flex w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
            onClick={closeMenu}
            role="menuitem"
            type="button"
          >
            Duplicate
          </button>
          <div className="-mx-1 my-1 h-px bg-border" />
          <button
            className="flex w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
            onClick={closeMenu}
            role="menuitem"
            type="button"
          >
            Archive
          </button>
          <button
            className="flex w-full rounded-sm px-2 py-1.5 text-left text-sm text-destructive hover:bg-accent focus:bg-accent focus:outline-none"
            onClick={closeMenu}
            role="menuitem"
            type="button"
          >
            Delete
          </button>
        </div>
      ) : null}
    </div>
  );
}
