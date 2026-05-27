import { Link, Outlet } from "react-router";
import { Package2, ShoppingCart } from "lucide-react";

import { Button } from "@otbt/ui";

export function RootLayout() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="border-b bg-background">
        <div className="storefront-container grid h-16 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-6 px-4 md:px-6">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg border bg-primary text-primary-foreground">
              <Package2 className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Order of the Black Thorn</p>
              <p className="truncate text-xs text-muted-foreground">Dark florals and keepsakes</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a className="font-medium text-foreground" href="#catalogue">
              Collection
            </a>
            <a href="#occasions">Occasions</a>
            <a href="#about">About</a>
          </nav>

          <div className="flex items-center justify-end gap-2">
            <Button size="icon" variant="ghost">
              <ShoppingCart className="size-4" />
              <span className="sr-only">Cart</span>
            </Button>
          </div>
        </div>
      </header>

      <Outlet />
    </div>
  );
}
