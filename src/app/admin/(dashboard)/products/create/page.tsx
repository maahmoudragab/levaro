import { createClient } from "@/lib/supabase/server";
import AddProductForm from "@/components/dashboard/ProductsComponents/ProductForm";

/**
 * Admin Create Product Page (Server Component).
 * Fetches available categories and current product count to pre-generate initial SKU.
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
      .select("id, name, slug")
      .order("name", { ascending: true }),
    supabase
      .from("products")
      .select("*", { count: "exact", head: true }),
  ]);

  if (categoriesError) {
    throw new Error(categoriesError.message);
  }

  return (
    <AddProductForm
      categories={categories ?? []}
      initialProductCount={productCount ?? 0}
      initialProductId={newProductId}
      mode="create"
    />
  );
}
