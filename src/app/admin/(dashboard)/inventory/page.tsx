import { getProducts } from "@/app/services/admin/products";
import InventoryClient from "@/components/dashboard/inventory/InventoryClient";

export const metadata = {
  title: "Inventory | LÉVARO Admin",
};

/**
 * Admin Inventory Page (Server Component).
 * Fetches initial product catalog from Supabase via optimized join and passes to the inventory client.
 */
export default async function InventoryPage() {
  const products = await getProducts();

  return <InventoryClient initialProducts={products} />;
}
