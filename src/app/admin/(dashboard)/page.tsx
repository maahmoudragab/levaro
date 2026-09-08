import { TopHeader } from "@/components/shared/TopHeader";
import { getProducts } from "@/services/admin/products";
import { getCategoriesHierarchy } from "@/services/admin/categories";
import { DashboardOverview } from "@/components/admin/overview/DashboardOverview";

export const metadata = {
  title: "Dashboard | LÉVARO Admin",
};

/**
 * Admin Overview Dashboard Page (Server Component).
 * Renders TopHeader, high-level atelier archive metrics, recent pieces, and category tree.
 */
export default async function AdminOverviewPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategoriesHierarchy(),
  ]);

  return (
    <div className="p-3 sm:p-6 flex flex-col gap-6 font-sans">
      <TopHeader
        title="Atelier Overview"
        description="Welcome back to LÉVARO Atelier. Manage archived editions, disciplines, and lookbook capsules."
        buttonName="Add New Edition"
        buttonHref="/admin/products/create"
      />

      <DashboardOverview products={products} categories={categories} />
    </div>
  );
}

