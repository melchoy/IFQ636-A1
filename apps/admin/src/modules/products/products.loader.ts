import { redirect } from "react-router";

import { queryClient } from "../../lib/query-client";
import { getAdminToken } from "../auth/auth.storage";
import { productListQuery } from "./products.query";

export async function productListLoader() {
  if (!getAdminToken()) {
    throw redirect("/login");
  }

  return queryClient.ensureQueryData(productListQuery);
}
