import { useLoaderData, useNavigate } from "react-router";
import { Link } from "@otbt/web";

import type { AdminProductUpdateRequest as ProductUpdateRequest } from "@otbt/types";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
} from "@otbt/ui";

import {
  ProductForm,
  useProductDetail,
  useRemoveProductImage,
  useUpdateProduct,
  useUploadProductImage,
} from "../../../modules/products";

type ProductEditLoaderData = {
  productId: string;
};

export function CatalogueEditPage() {
  const { productId } = useLoaderData() as ProductEditLoaderData;
  const { product } = useProductDetail(productId);
  const navigate = useNavigate();
  const updateProduct = useUpdateProduct(productId);
  const uploadProductImage = useUploadProductImage(productId);
  const removeProductImage = useRemoveProductImage(productId);

  async function saveProduct(productDraft: ProductUpdateRequest) {
    await updateProduct.mutateAsync(productDraft);
    navigate("/");
  }

  async function uploadProductImageFile(file: File) {
    const response = await uploadProductImage.mutateAsync(file);
    return response.imageUrl;
  }

  async function removeProductImageFile() {
    const response = await removeProductImage.mutateAsync();
    return response.product.imageUrl;
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <Link
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  to="/"
                >
                  Catalog
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{product.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              {product.name}
            </h1>
            <p className="text-sm text-muted-foreground md:text-base">
              Update catalogue content, pricing, stock, and publishing controls.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button asChild variant="outline">
            <Link to="/" unstyled>
              Cancel
            </Link>
          </Button>
          <Button
            disabled={updateProduct.isPending}
            form="product-edit-form"
            type="submit"
          >
            {updateProduct.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <ProductForm
        defaultValues={product}
        error={updateProduct.error}
        formId="product-edit-form"
        imageControls={{
          onImageRemove: removeProductImageFile,
          onImageUpload: uploadProductImageFile,
          removingImage: removeProductImage.isPending,
          uploadingImage: uploadProductImage.isPending,
        }}
        onSubmit={saveProduct}
        submitting={updateProduct.isPending}
      />
    </section>
  );
}
