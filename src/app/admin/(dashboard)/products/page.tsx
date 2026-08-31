import { getProducts } from "@/app/services/admin/products";
import { getActiveCategoriesList } from "@/app/services/admin/categories";
import ProductsClient from "@/components/dashboard/products/ProductsClient";

export const metadata = {
  title: "Products | LÉVARO Admin",
};

/**
 * Admin Products Catalog Page (Server Component).
 * Fetches product catalog and active category hierarchy via SSR.
 */
export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getActiveCategoriesList(),
  ]);

  return (
    <ProductsClient
      initialProducts={products}
      categoriesList={categories}
    />
  );
}