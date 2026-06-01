import { useParams } from "react-router";

import { ProductDetail } from "../../../modules/products/ui/product-detail";
import { usePublicProductQuery } from "../../../modules/products/products.query";

export function ProductDetailPage() {
  const { productId } = useParams();

  if (!productId) {
    throw new Error("Product id is required");
  }

  const { data, isError, isLoading } = usePublicProductQuery(productId);

  if (isLoading) {
    return (
      <main className="storefront-container px-4 py-8 md:px-6">
        <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
          Loading product...
        </div>
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className="storefront-container px-4 py-8 md:px-6">
        <div className="rounded-lg border bg-card p-8 text-center text-sm text-destructive">
          Could not load product.
        </div>
      </main>
    );
  }

  return <ProductDetail product={data.product} />;
}
