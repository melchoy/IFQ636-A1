import { Link, Outlet } from "react-router";
import { Menu, Package2, ShoppingCart } from "lucide-react";

import {
  Button,
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@otbt/ui";

type StorefrontNavItem = {
  label: string;
  href: string;
};

const storefrontNavItems: StorefrontNavItem[] = [
  { label: "Collection", href: "/" },
  { label: "Occasions", href: "#occasions" },
  { label: "About", href: "#about" },
];

export function RootLayout() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="border-b bg-background">
        <div className="storefront-container grid h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-6 md:px-6">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-primary text-primary-foreground">
              <Package2 className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                Order of the Black Thorn
              </p>
              <p className="truncate text-xs text-muted-foreground">
                Lorem ipsum
              </p>
            </div>
          </Link>

          <nav className="hidden items-center justify-center gap-7 text-sm text-muted-foreground md:flex">
            {storefrontNavItems.map((item, index) => (
              <a
                className={index === 0 ? "font-medium text-foreground" : undefined}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-2">
            <Button size="icon" variant="ghost">
              <ShoppingCart className="size-4" />
              <span className="sr-only">Cart</span>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button className="md:hidden" size="icon" variant="ghost">
                  <Menu className="size-4" />
                  <span className="sr-only">Open navigation</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="w-72 p-5" side="right">
                <SheetHeader className="pr-8 text-left">
                  <SheetTitle className="text-base">
                    Order of the Black Thorn
                  </SheetTitle>
                </SheetHeader>
                <nav className="mt-5 flex flex-col gap-1 border-t pt-4 text-sm">
                  {storefrontNavItems.map((item, index) => (
                    <SheetClose asChild key={item.href}>
                      <a
                        className={
                          index === 0
                            ? "rounded-md px-3 py-2.5 font-medium text-foreground hover:bg-muted"
                            : "rounded-md px-3 py-2.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                        }
                        href={item.href}
                      >
                        {item.label}
                      </a>
                    </SheetClose>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <Outlet />
    </div>
  );
}
