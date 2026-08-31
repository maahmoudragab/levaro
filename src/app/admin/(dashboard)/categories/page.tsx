import { getCategoriesHierarchy } from "@/app/services/admin/categories";
import CategoriesClient from "@/components/dashboard/categories/CategoriesClient";

export const metadata = {
  title: "Categories & Collections | LÉVARO Admin",
};

/**
 * Admin Categories & Collections Management Page (Server Component).
 * Fetches hierarchical category tree with nested collections and metrics via SSR.
 */
export default async function CategoriesPage() {
  const categories = await getCategoriesHierarchy();

  return <CategoriesClient initialCategories={categories} />;
}
