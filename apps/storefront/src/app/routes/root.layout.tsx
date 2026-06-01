import { Outlet } from "react-router";

import { SiteHeader } from "../../modules/navigation/site-header";

export function RootLayout() {
  return (
    <div className="min-h-svh text-foreground">
      <SiteHeader />
      <Outlet />
    </div>
  );
}
