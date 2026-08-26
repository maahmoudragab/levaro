import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProductBySlug } from "@/app/services/admin/products";
import AddProductForm from "@/components/dashboard/ProductsComponents/ProductForm";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

/**
 * Admin Edit Product Page (Server Component).
 * Loads existing product details and category list by product slug (supports Arabic and Latin slugs).
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
      .select("id, name, slug")
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
    <AddProductForm
      categories={categories ?? []}
      initialProduct={product}
      mode="edit"
    />
  );
}
