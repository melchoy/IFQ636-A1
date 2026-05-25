import type { AdminUser } from "@otbt/types";
import { Avatar, AvatarFallback, AvatarImage, Button } from "@otbt/ui";
import { LogOut } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

interface AccountMenuProps {
  adminUser: AdminUser | null;
  onSignOut: () => void;
}

export function AccountMenu({ adminUser, onSignOut }: AccountMenuProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const adminEmail = adminUser?.email ?? "Admin user";
  const adminInitial = adminEmail.charAt(0).toUpperCase();

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

  function handleSignOut() {
    setOpen(false);
    onSignOut();
  }

  return (
    <div className="relative" ref={menuRef}>
      <Button
        aria-controls={open ? menuId : undefined}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Open account menu"
        className="h-10 rounded-full p-0 hover:bg-accent/80"
        onClick={() => setOpen((currentOpen) => !currentOpen)}
        type="button"
        variant="ghost"
      >
        <Avatar className="size-8 rounded-full">
          <AvatarImage alt={adminEmail} src="" />
          <AvatarFallback className="size-full rounded-full bg-primary font-medium text-primary-foreground">
            {adminInitial}
          </AvatarFallback>
        </Avatar>
      </Button>

      {open ? (
        <div
          className="absolute right-0 z-50 mt-2 min-w-48 max-w-60 overflow-hidden rounded-md border bg-popover text-left text-popover-foreground shadow-md"
          id={menuId}
          role="menu"
        >
          <div className="border-b px-3 py-2.5">
            <p className="truncate text-sm font-medium text-foreground">{adminEmail}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Signed in as admin</p>
          </div>

          <div className="p-1">
            <button
              className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm text-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
              onClick={handleSignOut}
              role="menuitem"
              type="button"
            >
              <LogOut className="size-4" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
