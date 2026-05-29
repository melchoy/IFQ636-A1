import { createBrowserRouter } from "react-router";

import { queryClient } from "../lib/query-client";
import {
  publicProductQueryOptions,
  publicProductsQueryOptions,
} from "../modules/products/products.query";
import { HomePage } from "./routes/home/home.page";
import { ProductDetailPage } from "./routes/products/product-detail.page";
import { RootLayout } from "./routes/root.layout";
import { RouteError } from "./routes/route-error";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        loader: () => queryClient.ensureQueryData(publicProductsQueryOptions()),
        element: <HomePage />,
        errorElement: <RouteError />,
      },
      {
        path: "products/:productId",
        loader: ({ params }) => {
          if (!params.productId) {
            throw new Response("Product not found", { status: 404 });
          }

          return queryClient.ensureQueryData(
            publicProductQueryOptions(params.productId),
          );
        },
        element: <ProductDetailPage />,
        errorElement: <RouteError />,
      },
      {
        path: "*",
        element: <RouteError />,
      },
    ],
  },
]);
