import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProductBySlug } from "@/services/admin/products";
import { ProductForm } from "@/components/admin/products/ProductForm";

export const metadata = {
  title: "Edit Product | LÉVARO Admin",
};

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

/**
 * Admin Edit Product Page (Server Component).
 * Loads existing product details and category/collection lists.
 */
export default async function EditProductPage({ params }: Props) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const supabase = await createClient();

  const [
    { data: categories, error: categoriesError },
    product,
  ] = await Promise.all([
    supabase
      .from("categories")
      .select("id, name, slug, parent_id, is_active")
      .order("name", { ascending: true }),
    getProductBySlug(decodedSlug),
  ]);

  if (categoriesError) {
    throw new Error(categoriesError.message);
  }

  if (!product) {
    notFound();
  }

  return (
    <ProductForm
      categories={categories ?? []}
      initialProduct={product}
      mode="edit"
    />
  );
}
