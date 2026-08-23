import type { Product } from "@/app/services/admin/products";

import ProductsClient from "@/components/dashboard/ProductsComponents/ProductsClient";

export default function Products({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  // Product page server boundary
  return <ProductsClient initialProducts={initialProducts} />;
}
