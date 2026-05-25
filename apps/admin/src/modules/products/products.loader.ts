import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";

import { queryClient } from "../../lib/query-client";
import { getAdminToken } from "../auth/auth.storage";
import { productDetailQuery, productListQuery } from "./products.query";

function requireProductId(params: LoaderFunctionArgs["params"]) {
  const productId = params.productId;

  if (!productId) {
    throw new Error("Product not found");
  }

  return productId;
}

export async function productListLoader() {
  if (!getAdminToken()) {
    throw redirect("/login");
  }

  return queryClient.ensureQueryData(productListQuery);
}

export async function productEditLoader({ params }: LoaderFunctionArgs) {
  if (!getAdminToken()) {
    throw redirect("/login");
  }

  const productId = requireProductId(params);

  await queryClient.ensureQueryData(productDetailQuery(productId));

  return { productId };
}
