import { createBrowserRouter } from "react-router";

import { queryClient } from "../lib/query-client";
import { publicProductsQueryOptions } from "../modules/products/products.query";
import { HomePage } from "./routes/home/home.page";
import { RootLayout } from "./routes/root.layout";
import { RouteError } from "./routes/route-error";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <RouteError />,
    children: [
      {
        index: true,
        loader: () => queryClient.ensureQueryData(publicProductsQueryOptions()),
        element: <HomePage />,
      },
    ],
  },
]);
