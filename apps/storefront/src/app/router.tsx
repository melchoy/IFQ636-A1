import { createBrowserRouter } from "react-router";

import { RootLayout } from "./routes/root.layout";
import { RouteError } from "./routes/route-error";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <RouteError />,
  },
]);
