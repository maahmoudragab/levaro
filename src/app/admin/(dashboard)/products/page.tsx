import { getProducts } from "@/app/services/admin/products";
import Products from "@/components/dashboard/ProductsComponents/Products";

export default async function ProductsPage() {
  const products = await getProducts();

  return <Products initialProducts={products} />;
}