import { createBrowserRouter } from "react-router";

import { AdminLayout } from "./routes/admin.layout";
import { CatalogueListPage } from "./routes/catalog/list.page";
import { RootLayout } from "./routes/root.layout";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          element: <AdminLayout />,
          children: [{ index: true, element: <CatalogueListPage /> }],
        },
      ],
    },
  ],
  {
    basename: "/admin/",
  },
);
