import { getProducts } from "@/app/services/admin/products";
import InventoryClient from "@/components/dashboard/InventoryComponents/InventoryClient";

export const metadata = {
  title: "Inventory | LÉVARO Admin",
};

/**
 * Admin Inventory Page (Server Component).
 * Fetches the initial product catalog from Supabase and passes it to the inventory client view.
 */
export default async function InventoryPage() {
  const products = await getProducts();

  return <InventoryClient initialProducts={products} />;
}
