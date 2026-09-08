import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/products/ProductForm";

export const metadata = {
  title: "Add Product | LÉVARO Admin",
};

/**
 * Admin Create Product Page (Server Component).
 * Fetches active categories & nested collections and current product count.
 */
export default async function CreateProductPage() {
  const supabase = await createClient();
  const newProductId = crypto.randomUUID();

  const [
    { data: categories, error: categoriesError },
    { count: productCount },
  ] = await Promise.all([
    supabase
      .from("categories")
      .select("id, name, slug, parent_id, is_active")
      .order("name", { ascending: true }),
    supabase
      .from("products")
      .select("*", { count: "exact", head: true }),
  ]);

  if (categoriesError) {
    throw new Error(categoriesError.message);
  }

  return (
    <ProductForm
      categories={categories ?? []}
      initialProductCount={productCount ?? 0}
      initialProductId={newProductId}
      mode="create"
    />
  );
}
