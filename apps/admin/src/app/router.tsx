import { createBrowserRouter } from "react-router";

import { RequireAdmin, requireAdminSession } from "../modules/auth";
import { productListLoader } from "../modules/products";
import { AdminLayout } from "./routes/admin.layout";
import { CatalogueListPage } from "./routes/catalog/list.page";
import { LoginPage } from "./routes/login/login.page";
import { PublicLayout } from "./routes/public.layout";
import { RootLayout } from "./routes/root.layout";
import { RouteError } from "./routes/route-error";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <RouteError />,
      children: [
        {
          element: <PublicLayout />,
          children: [
            {
              path: "login",
              element: <LoginPage />,
            },
          ],
        },
        {
          id: "admin",
          element: <RequireAdmin />,
          loader: requireAdminSession,
          children: [
            {
              element: <AdminLayout />,
              children: [{ index: true, loader: productListLoader, element: <CatalogueListPage /> }],
            },
          ],
        },
      ],
    },
  ],
  {
    basename: "/admin/",
  },
);
