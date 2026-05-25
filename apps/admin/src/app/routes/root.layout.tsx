import { Outlet } from "react-router";

import { AuthProvider } from "../../modules/auth";

export function RootLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
