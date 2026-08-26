import { getProducts } from "@/app/services/admin/products";
import Products from "@/components/dashboard/ProductsComponents/Products";

/**
 * Admin Products Page (Server Component).
 * Fetches the initial product catalog from Supabase and passes it to the client view.
 */
export default async function ProductsPage() {
  const products = await getProducts();

  return <Products initialProducts={products} />;
}