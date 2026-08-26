import type { Product } from "@/app/services/admin/products";
import ProductsClient from "@/components/dashboard/ProductsComponents/ProductsClient";

/**
 * Products Component (Server boundary).
 * Passes server-fetched products data to the interactive client controller.
 */
export default function Products({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  return <ProductsClient initialProducts={initialProducts} />;
}
