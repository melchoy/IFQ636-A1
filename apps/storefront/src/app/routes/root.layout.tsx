import { Outlet } from "react-router";

import { SiteHeader } from "../../modules/navigation/site-header";

export function RootLayout() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteHeader />
      <Outlet />
    </div>
  );
}
