import type { AdminProductListResponse as ProductListResponse } from "@otbt/types";

import { adminHttpRequest } from "../../lib/http.client";

export function fetchProductList() {
  return adminHttpRequest<ProductListResponse>("/products");
}
