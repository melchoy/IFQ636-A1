import { Outlet } from "react-router";

import { SiteFooter } from "../../modules/navigation/site-footer";
import { SiteHeader } from "../../modules/navigation/site-header";

export function RootLayout() {
  return (
    <div className="flex min-h-svh flex-col pb-10 text-foreground">
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <Outlet />
      </div>
      <SiteFooter />
    </div>
  );
}
