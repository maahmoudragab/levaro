import { TopHeader } from "@/components/dashboard/categories/shared/TopHeader";

export const metadata = {
  title: "Dashboard | LÉVARO Admin",
};

/**
 * Admin Overview Dashboard Page (Server Component).
 * Renders TopHeader only.
 */
export default async function AdminOverviewPage() {
  return (
    <div className="p-3 sm:p-4 flex flex-col gap-4 font-sans">
      <TopHeader
        title="Dashboard"
        description="Welcome back to LÉVARO Atelier. Overview & storefront management."
        buttonName="Add New Product"
        buttonHref="/admin/products/create"
      />
    </div>
  );
}
