import type { AdminUser } from "@otbt/types";
import { createContext, useContext, useMemo, type ReactNode } from "react";
import { Outlet, redirect, useMatches } from "react-router";

import { getCurrentAdmin, loginAdmin } from "./auth.api";
import { clearAdminToken, getAdminToken, setAdminToken } from "./auth.storage";

interface AuthContextValue {
  adminUser: AdminUser | null;
  authenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export interface AdminAuthLoaderData {
  adminUser: AdminUser;
}

export async function requireAdminSession(): Promise<AdminAuthLoaderData> {
  const token = getAdminToken();

  if (!token) {
    throw redirect("/login");
  }

  try {
    return {
      adminUser: await getCurrentAdmin(),
    };
  } catch {
    clearAdminToken();
    throw redirect("/login");
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const matches = useMatches();
  const adminRouteData = matches.find((match) => match.id === "admin")?.data as AdminAuthLoaderData | undefined;
  const adminUser = adminRouteData?.adminUser ?? null;

  const value = useMemo<AuthContextValue>(
    () => ({
      adminUser,
      authenticated: Boolean(adminUser),
      login: async (email, password) => {
        const response = await loginAdmin(email, password);

        setAdminToken(response.token);
      },
      logout: () => {
        clearAdminToken();
      },
    }),
    [adminUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}

export function RequireAdmin() {
  return <Outlet />;
}
