import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@otbt/ui";

import { ProductList, useProductList } from "../../../modules/products";

export function CatalogueListPage() {
  const productList = useProductList();

  return (
    <section className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Catalog</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Products</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Products</h1>
            <p className="text-sm text-muted-foreground md:text-base">
              Manage inventory, pricing, visibility, and publishing state.
            </p>
          </div>
        </div>
      </div>

      <ProductList products={productList.products} />
    </section>
  );
}
