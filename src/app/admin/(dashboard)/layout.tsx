import Sidebar from "@/components/dashboard/Sidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/**
 * Admin Dashboard Root Layout.
 * Provides sidebar navigation and server-side authentication protection for all `/admin` routes.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side auth verification safeguard
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();

  if (!claims) {
    redirect("/admin/login");
  }

  return (
    <main className="flex min-h-screen flex-col lg:flex-row">
      <Sidebar />
      <div className="flex-1 bg-zinc-200">{children}</div>
    </main>
  );
}